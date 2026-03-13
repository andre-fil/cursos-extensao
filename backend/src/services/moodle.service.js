/**
 * Integração com Moodle via Web Services REST.
 * Parâmetros sempre na URL (querystring); não usar body JSON nem form-urlencoded.
 */

const MOODLE_BASE_URL = (process.env.MOODLE_BASE_URL || "").replace(/\/$/, "");
const MOODLE_TOKEN = process.env.MOODLE_TOKEN || "";

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
  const username = String(user.username ?? user.email ?? "").trim();
  const password = String(user.password ?? "").trim();
  const firstname = String(user.firstname ?? "").trim();
  const lastname = String(user.lastname ?? "").trim();
  const email = String(user.email ?? "").trim();

  if (!username) throw new Error("username é obrigatório");
  if (!password) throw new Error("password é obrigatório");
  if (!email) throw new Error("email é obrigatório");

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
  if (!Array.isArray(data) || data.length === 0 || data[0].id === undefined) {
    throw new Error("Moodle não retornou ID do usuário");
  }
  return { id: data[0].id };
}

// ——— Stubs (próxima etapa: enrol_manual_enrol_users) ———
export async function findUserByRegistration(registration) {
  console.log("[moodle] findUserByRegistration não implementado nesta etapa");
  return null;
}

export async function findUserByEmail(email) {
  return getUserByEmail(email);
}

export async function isUserEnrolledInCourse(userId, courseId) {
  console.log("[moodle] isUserEnrolledInCourse não implementado nesta etapa");
  return false;
}

export async function enrollUserInCourse(userId, moodleCourseId) {
  console.log("[moodle] enrollUserInCourse não implementado nesta etapa");
}
