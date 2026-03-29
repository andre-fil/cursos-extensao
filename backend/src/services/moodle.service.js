/**
 * Integração com Moodle via Web Services REST.
 * Parâmetros sempre na URL (querystring); não usar body JSON nem form-urlencoded.
 */

const MOODLE_BASE_URL = (process.env.MOODLE_BASE_URL || "").replace(/\/$/, "");
const MOODLE_TOKEN = process.env.MOODLE_TOKEN || "";
const MOODLE_ROLE_ID = parseInt(process.env.MOODLE_ROLE_ID || "5", 10); // 5 = student (padrão)

function buildMoodleUrl(params) {
  const searchParams = new URLSearchParams({
    wstoken: MOODLE_TOKEN,
    moodlewsrestformat: "json",
    ...params,
  });
  return `${MOODLE_BASE_URL}/webservice/rest/server.php?${searchParams.toString()}`;
}

/** Parse JSON seguro (Moodle às vezes responde corpo vazio em sucesso). */
async function safeJson(res) {
  const text = await res.text();
  if (!text || !text.trim()) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { _raw: text };
  }
}

/** Operações de escrita: POST com parâmetros só na URL (sem body), evita limite/travamento de GET longo. */
async function moodleWrite(url) {
  console.log("[moodle] request (POST):", url.replace(/wstoken=[^&]*/, "wstoken=***"));
  const res = await fetch(url, { method: "POST", headers: { Accept: "application/json" } });
  const data = await safeJson(res);
  console.log("[moodle] response:", data);
  return data;
}

/**
 * Busca usuário no Moodle pelo e-mail.
 * wsfunction=core_user_get_users, critéria email.
 * @param {string} email
 * @returns {Promise<{id: number, username: string, email: string}|null>}
 */
export async function getUserByEmail(email) {
  if (!email || typeof email !== "string") return null;
  const trimmed = String(email).trim();
  if (!trimmed) return null;

  const params = {
    wsfunction: "core_user_get_users",
    "criteria[0][key]": "email",
    "criteria[0][value]": trimmed,
  };
  const url = buildMoodleUrl(params);
  console.log("[moodle] request:", url.replace(/wstoken=[^&]*/, "wstoken=***"));

  const res = await fetch(url, { method: "GET" });
  const data = await res.json();
  console.log("[moodle] response:", data);

  if (data.exception) throw new Error(data.message || data.exception);
  const users = Array.isArray(data) ? data : (data.users || []);
  if (users.length === 0) return null;
  const u = users[0];
  return { id: u.id, username: u.username, email: u.email };
}

/**
 * Cria usuário no Moodle.
 * wsfunction=core_user_create_users; todos os parâmetros na querystring.
 * @param {{ username: string, password: string, firstname: string, lastname: string, email: string }} user
 * @returns {Promise<{id: number}>}
 */
export async function createUser(user) {
  const email = String(user.email ?? "").trim();
  if (!email) throw new Error("email é obrigatório");

  // Para o fluxo do webhook, password pode não vir. Usamos um padrão seguro (configurável).
  const password =
    String(user.password ?? process.env.MOODLE_TEST_PASSWORD ?? "Temp@Moodle123").trim();

  // Username pode vir pronto ou ser derivado do e-mail para evitar colisões e respeitar charset.
  let username = String(user.username ?? "").trim();
  if (!username) {
    username = email
      .replace(/[^a-zA-Z0-9._@-]/g, "_")
      .toLowerCase();
  }
  if (!username) username = "user_" + Date.now();

  const firstname = String(user.firstname ?? "Aluno").trim();
  const lastname = String(user.lastname ?? "FEMAF").trim();

  const params = {
    wsfunction: "core_user_create_users",
    "users[0][username]": username,
    "users[0][password]": password,
    "users[0][firstname]": firstname,
    "users[0][lastname]": lastname,
    "users[0][email]": email,
    "users[0][auth]": "manual",
    "users[0][lang]": "pt_br",
  };
  const url = buildMoodleUrl(params);
  const data = await moodleWrite(url);

  if (data.exception) throw new Error(data.message || data.exception);
  const createdUsers = Array.isArray(data) ? data : (Array.isArray(data.users) ? data.users : []);
  if (!createdUsers || createdUsers.length === 0 || createdUsers[0].id === undefined) {
    // Alguns deployments podem retornar { user: { id: ... } } ou similar.
    const fallbackId = data?.user?.id ?? data?.id;
    if (fallbackId === undefined) throw new Error("Moodle não retornou ID do usuário");
    return { id: fallbackId };
  }
  return { id: createdUsers[0].id };
}

/** Mesma regra de deriveUsername que createUser (evita divergência com webhooks duplicados). */
export function emailToMoodleUsername(email) {
  const e = String(email ?? "").trim();
  if (!e) return "user_" + Date.now();
  const u = e.replace(/[^a-zA-Z0-9._@-]/g, "_").toLowerCase();
  return u || "user_" + Date.now();
}

export async function getUserByUsername(username) {
  const u = String(username ?? "").trim();
  if (!u) return null;
  const params = {
    wsfunction: "core_user_get_users",
    "criteria[0][key]": "username",
    "criteria[0][value]": u,
  };
  const url = buildMoodleUrl(params);
  console.log("[moodle] request (username):", url.replace(/wstoken=[^&]*/, "wstoken=***"));
  const res = await fetch(url, { method: "GET" });
  const data = await res.json();
  if (data.exception) throw new Error(data.message || data.exception);
  const users = Array.isArray(data) ? data : (data.users || []);
  console.log("[moodle] response (username):", users.length, "usuário(s)");
  if (users.length === 0) return null;
  const row = users[0];
  return { id: row.id, username: row.username, email: row.email };
}

/**
 * Garante registro no Moodle: evita falha quando dois webhooks correm createUser (e-mail/username já existe).
 */
export async function ensureMoodleUser({ email, firstname, lastname }) {
  const em = String(email ?? "").trim();
  if (!em) throw new Error("email é obrigatório");
  const fn = String(firstname ?? "Aluno").trim();
  const ln = String(lastname ?? "FEMAF").trim();

  let user = await getUserByEmail(em);
  if (user) return user;

  const uname = emailToMoodleUsername(em);
  user = await getUserByUsername(uname);
  if (user) return user;

  try {
    const created = await createUser({ email: em, firstname: fn, lastname: ln });
    return { id: created.id, email: em, username: uname };
  } catch (e) {
    const msg = String(e.message || "");
    if (/already|duplicate|exist|registered|utilizado|cadastrado|em uso|já existe/i.test(msg)) {
      user = await getUserByEmail(em);
      if (user) return user;
      user = await getUserByUsername(uname);
      if (user) return user;
    }
    throw e;
  }
}

// ——— Implementação atual: enrol_manual_enrol_users (matrícula no curso) ———
export async function findUserByRegistration(registration) {
  console.log("[moodle] findUserByRegistration não implementado nesta etapa");
  return null;
}

export async function findUserByEmail(email) {
  return getUserByEmail(email);
}

export async function isUserEnrolledInCourse(userId, courseId) {
  if (!userId || !courseId) return false;

  const params = {
    wsfunction: "core_enrol_get_enrolled_users",
    courseid: String(courseId),
  };
  const url = buildMoodleUrl(params);
  console.log("[moodle] request:", url.replace(/wstoken=[^&]*/, "wstoken=***"));

  const res = await fetch(url, { method: "GET" });
  const data = await res.json();
  console.log("[moodle] response:", data);

  if (data.exception) throw new Error(data.message || data.exception);
  const users = Array.isArray(data) ? data : (Array.isArray(data.users) ? data.users : []);
  return users.some((u) => {
    const uid = u.id ?? u.userid ?? u.user_id;
    return Number(uid) === Number(userId);
  });
}

function isMessageNotSentError(data) {
  if (!data || !data.exception) return false;
  const msg = String(data.message || data.errorcode || data.exception || "");
  return /Message was not sent/i.test(msg);
}

/** POST application/x-www-form-urlencoded (alguns Moodles tratam enrol melhor no body). */
async function moodleWriteForm(paramsFlat) {
  const formUrl = `${MOODLE_BASE_URL}/webservice/rest/server.php`;
  const body = new URLSearchParams({
    wstoken: MOODLE_TOKEN,
    moodlewsrestformat: "json",
    ...paramsFlat,
  });
  console.log("[moodle] request (POST form):", formUrl, "| wsfunction:", paramsFlat.wsfunction);
  const res = await fetch(formUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });
  const data = await safeJson(res);
  console.log("[moodle] response (form):", data);
  return data;
}

export async function enrollUserInCourse(userId, moodleCourseId) {
  if (!userId || !moodleCourseId) throw new Error("userId e moodleCourseId são obrigatórios");

  const params = {
    wsfunction: "enrol_manual_enrol_users",
    "enrolments[0][userid]": String(userId),
    "enrolments[0][courseid]": String(moodleCourseId),
    "enrolments[0][roleid]": String(MOODLE_ROLE_ID),
  };

  const url = buildMoodleUrl(params);

  /** Pequena pausa: Moodle pode demorar a refletir em core_enrol_get_enrolled_users. */
  async function confirmEnrolled() {
    const delays = [200, 600, 1200];
    for (const ms of delays) {
      await new Promise((r) => setTimeout(r, ms));
      try {
        if (await isUserEnrolledInCourse(userId, moodleCourseId)) return true;
      } catch (e) {
        console.log("[moodle] confirmEnrolled check error:", e.message);
      }
    }
    return false;
  }

  // 1) POST querystring (padrão do projeto)
  let data = await moodleWrite(url);
  if (!data?.exception && (await confirmEnrolled())) return;

  if (data?.exception) {
    const msg = String(data.message || data.errorcode || data.exception);
    if (!isMessageNotSentError(data)) {
      // Erro “duro”: ainda assim tentamos GET/form (às vezes primeiro POST falha por timeout/parse)
      console.log("[moodle] enrol POST (URL) exception:", msg);
    } else {
      console.log("[moodle] enrol POST (URL) — Message was not sent; verificando/retries…");
    }
  }

  if (await confirmEnrolled()) return;

  // 2) GET com mesmos parâmetros (comportamento REST clássico do Moodle)
  console.log("[moodle] retry enrol via GET");
  const resGet = await fetch(url, { method: "GET", headers: { Accept: "application/json" } });
  data = await safeJson(resGet);
  console.log("[moodle] response (GET enrol):", data);
  if (data?.exception && !isMessageNotSentError(data)) {
    console.log("[moodle] GET enrol error:", data.message);
  }
  if (await confirmEnrolled()) return;

  // 3) POST form-urlencoded (estrutura enrolments[] mais confiável em alguns servidores)
  console.log("[moodle] retry enrol via POST form body");
  data = await moodleWriteForm(params);
  if (data?.exception && !isMessageNotSentError(data)) {
    throw new Error(String(data.message || data.exception));
  }
  if (await confirmEnrolled()) return;

  throw new Error(
    "Matrícula não confirmada no Moodle após POST (URL), GET e POST (form). " +
      "Verifique matrícula manual ativa no curso, papel do token e notificações/SMTP no Moodle (erro comum: Message was not sent)."
  );
}

// Alias para compatibilidade com nomenclatura do usuário.
export const enrolUser = enrollUserInCourse;
