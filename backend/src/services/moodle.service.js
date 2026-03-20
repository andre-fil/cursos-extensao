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
  console.log("[moodle] request:", url);

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
  console.log("[moodle] request:", url);

  const res = await fetch(url, { method: "GET" });
  const data = await res.json();
  console.log("[moodle] response:", data);

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
  console.log("[moodle] request:", url);

  const res = await fetch(url, { method: "GET" });
  const data = await res.json();
  console.log("[moodle] response:", data);

  if (data.exception) throw new Error(data.message || data.exception);
  const users = Array.isArray(data) ? data : (Array.isArray(data.users) ? data.users : []);
  return users.some((u) => Number(u.id) === Number(userId));
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
  console.log("[moodle] request:", url);
  const res = await fetch(url, { method: "GET" });
  const data = await res.json();
  console.log("[moodle] response:", data);

  if (data.exception) throw new Error(data.message || data.exception);
}

// Alias para compatibilidade com nomenclatura do usuário.
export const enrolUser = enrollUserInCourse;
