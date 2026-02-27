/**
 * Integração com Moodle via Web Services REST.
 * DESATIVADO para teste de fluxo MP/AWS — nenhuma chamada a /webservice/rest/server.php ou core_user_*.
 * Ao reativar, descomente as implementações abaixo.
 */

// const MOODLE_BASE_URL = (process.env.MOODLE_BASE_URL || "").replace(/\/$/, "");
// const MOODLE_TOKEN = process.env.MOODLE_TOKEN || "";
// const MOODLE_ROLE_ID = parseInt(process.env.MOODLE_ROLE_ID || "5", 10);

// function getMoodleUrl(wsfunction, params = {}) { ... }

export async function findUserByRegistration(registration) {
  console.log("[moodle.service] Moodle DESATIVADO — findUserByRegistration (teste de fluxo MP/AWS)");
  return null;
}

export async function findUserByEmail(email) {
  console.log("[moodle.service] Moodle DESATIVADO — findUserByEmail (teste de fluxo MP/AWS)");
  return null;
}

export async function isUserEnrolledInCourse(userId, courseId) {
  console.log("[moodle.service] Moodle DESATIVADO — isUserEnrolledInCourse (teste de fluxo MP/AWS)");
  return false;
}

export async function createUser(user) {
  console.log("[moodle.service] Moodle DESATIVADO — createUser (teste de fluxo MP/AWS)");
  throw new Error("Moodle desativado para testes");
}

export async function enrollUserInCourse(userId, moodleCourseId) {
  console.log("[moodle.service] Moodle DESATIVADO — enrollUserInCourse (teste de fluxo MP/AWS)");
}
