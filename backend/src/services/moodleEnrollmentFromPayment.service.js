import { getUserByEmail, createUser, enrollUserInCourse, isUserEnrolledInCourse } from "./moodle.service.js";
import { getMoodleCourseId } from "../utils/courseMap.js";

export function parsePaymentExternalReference(payment) {
  const ref = payment.external_reference ?? payment.external_reference_id;
  if (!ref || typeof ref !== "string") return null;
  const parts = ref.split("|");
  if (parts.length !== 3) return null;
  return { courseId: parts[0], type: parts[1], identifier: parts[2] };
}

function payerDisplayName(payment) {
  const p = payment?.payer && typeof payment.payer === "object" ? payment.payer : {};
  const first = String(p.first_name ?? p.name ?? "").trim() || "Aluno";
  const last = String(p.last_name ?? "").trim() || "FEMAF";
  return { firstname: first, lastname: last };
}

/**
 * Garante usuário no Moodle e matrícula no curso (pagamento já approved).
 * Usado pelo webhook do MP e por GET /checkout/verify-enrollment quando o webhook não chegou.
 */
export async function syncMoodleAfterApprovedPayment(payment, logPrefix = "[moodle-sync]") {
  const parsed = parsePaymentExternalReference(payment);
  if (!parsed) {
    console.log(logPrefix, "external_reference inválido");
    return { ok: false, reason: "bad_ref" };
  }

  const { courseId: extCourseId, type, identifier } = parsed;
  let email = String(identifier ?? "").trim();
  const payerEmail = payment?.payer?.email ? String(payment.payer.email).trim() : "";
  // external_reference (tipo new) traz o e-mail; se vier só matrícula (existing), tenta o pagador no MP
  if (!email.includes("@") && payerEmail) email = payerEmail;

  if (!email || !email.includes("@")) {
    console.log(logPrefix, "sem e-mail válido (identifier / payer)");
    return { ok: false, reason: "no_email" };
  }

  const moodleCourseId = getMoodleCourseId(extCourseId);
  if (!moodleCourseId) {
    console.log(logPrefix, "curso não mapeado:", extCourseId);
    return { ok: false, reason: "no_course" };
  }

  const payer = payerDisplayName(payment);

  let user = await getUserByEmail(email);
  if (!user) {
    console.log(logPrefix, "criando usuário Moodle:", email);
    const created = await createUser({
      email,
      firstname: payer.firstname,
      lastname: payer.lastname,
    });
    user = { id: created.id, email, username: email };
  }

  if (!user?.id) {
    return { ok: false, reason: "no_user_id" };
  }

  console.log(logPrefix, "matriculando userId", user.id, "curso Moodle", moodleCourseId);
  await enrollUserInCourse(user.id, moodleCourseId);
  const enrolled = await isUserEnrolledInCourse(user.id, moodleCourseId);
  return { ok: true, enrolled, userId: user.id, email, moodleCourseId };
}
