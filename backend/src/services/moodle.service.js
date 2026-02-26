/**
 * Integração com Moodle via Web Services REST.
 * Cria usuário, busca por matrícula (idnumber) e matricula em curso.
 * Não duplica usuário nem matrícula.
 */

const MOODLE_BASE_URL = (process.env.MOODLE_BASE_URL || "").replace(/\/$/, "");
const MOODLE_TOKEN = process.env.MOODLE_TOKEN || "";
const MOODLE_ROLE_ID = parseInt(process.env.MOODLE_ROLE_ID || "5", 10); // 5 = student

function getMoodleUrl(wsfunction, params = {}) {
  const searchParams = new URLSearchParams({
    wstoken: MOODLE_TOKEN,
    wsfunction,
    moodlewsrestformat: "json",
    ...params,
  });
  return `${MOODLE_BASE_URL}/webservice/rest/server.php?${searchParams.toString()}`;
}

/**
 * Busca usuário no Moodle pelo campo idnumber (matrícula EAD).
 * @param {string} registration - Matrícula EAD
 * @returns {Promise<{id: number}|null>} - Usuário ou null
 */
export async function findUserByRegistration(registration) {
  if (!registration || typeof registration !== "string") return null;
  const trimmed = String(registration).trim();
  if (!trimmed) return null;

  const url = getMoodleUrl("core_user_get_users", {
    "criteria[0][key]": "idnumber",
    "criteria[0][value]": trimmed,
  });
  const res = await fetch(url, { method: "GET" });
  const data = await res.json();
  if (data.exception) throw new Error(data.message || data.exception);
  if (!Array.isArray(data) || data.length === 0) return null;
  return { id: data[0].id };
}

/**
 * Cria usuário no Moodle.
 * Username = e-mail. Senha = CPF (apenas números).
 * @param {{ firstname: string, lastname: string, email: string, cpf?: string }} user
 * @returns {Promise<{id: number}>} - { id: moodleUserId }
 */
export async function createUser(user) {
  const email = String(user.email || "").trim();
  if (!email) throw new Error("E-mail é obrigatório para criar usuário");
  const cpf = String(user.cpf || "").replace(/\D/g, "").slice(0, 11);
  if (!cpf || cpf.length < 11) throw new Error("CPF é obrigatório para criar usuário (senha no EAD)");

  const body = new URLSearchParams({
    wstoken: MOODLE_TOKEN,
    wsfunction: "core_user_create_users",
    moodlewsrestformat: "json",
    "users[0][username]": email,
    "users[0][firstname]": String(user.firstname || "").trim(),
    "users[0][lastname]": String(user.lastname || "").trim(),
    "users[0][email]": email,
    "users[0][password]": cpf,
  });
  if (user.idnumber) body.append("users[0][idnumber]", String(user.idnumber).trim());

  const res = await fetch(`${MOODLE_BASE_URL}/webservice/rest/server.php`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  const data = await res.json();
  if (data.exception) throw new Error(data.message || data.exception);
  if (!Array.isArray(data) || data.length === 0 || data[0].id === undefined) {
    throw new Error("Moodle não retornou ID do usuário");
  }
  return { id: data[0].id };
}

/**
 * Matricula usuário em um curso (manual enrolment).
 * @param {number} userId - ID do usuário no Moodle
 * @param {number} moodleCourseId - ID do curso no Moodle
 * @returns {Promise<void>}
 */
export async function enrollUserInCourse(userId, moodleCourseId) {
  const body = new URLSearchParams({
    wstoken: MOODLE_TOKEN,
    wsfunction: "enrol_manual_enrol_users",
    moodlewsrestformat: "json",
    "enrolments[0][userid]": String(userId),
    "enrolments[0][courseid]": String(moodleCourseId),
    "enrolments[0][roleid]": String(MOODLE_ROLE_ID),
  });

  const res = await fetch(`${MOODLE_BASE_URL}/webservice/rest/server.php`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  const data = await res.json();
  if (data.exception) throw new Error(data.message || data.exception);
}
