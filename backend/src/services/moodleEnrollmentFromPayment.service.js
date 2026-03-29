import { ensureMoodleUser, enrollUserInCourse, isUserEnrolledInCourse } from "./moodle.service.js";
import { getMoodleCourseId } from "../utils/courseMap.js";

export function parsePaymentExternalReference(payment) {
  const ref = payment.external_reference ?? payment.external_reference_id;
  if (!ref || typeof ref !== "string") return null;
  const parts = ref.split("|");
  if (parts.length !== 3) return null;
  return { courseId: parts[0], type: parts[1], identifier: parts[2] };
}

/** Metadata da preferência (Checkout Pro) vem no pagamento; o objeto payer muitas vezes não traz nome no webhook. */
function readMetadata(payment) {
  const m = payment?.metadata;
  if (m && typeof m === "object" && !Array.isArray(m)) return m;
  return {};
}

function metaField(meta, ...keys) {
  for (const k of keys) {
    if (meta[k] != null && String(meta[k]).trim()) return String(meta[k]).trim();
    const found = Object.keys(meta).find((x) => x.toLowerCase() === String(k).toLowerCase());
    if (found != null && meta[found] != null && String(meta[found]).trim()) return String(meta[found]).trim();
  }
  return "";
}

function payerDisplayName(payment) {
  const meta = readMetadata(payment);
  const mFn = metaField(meta, "femaf_firstname", "femaf_fn");
  const mLn = metaField(meta, "femaf_lastname", "femaf_ln");
  const p = payment?.payer && typeof payment.payer === "object" ? payment.payer : {};
  const first = (mFn || String(p.first_name ?? p.name ?? "").trim()).trim();
  const last = (mLn || String(p.last_name ?? "").trim()).trim();
  return {
    firstname: first || "Aluno",
    lastname: last || "FEMAF",
  };
}

/**
 * Garante usuário no Moodle e matrícula no curso (pagamento já approved).
 * Usado pelo webhook do MP e por GET /checkout/verify-enrollment quando o webhook não chegou.
 */
export async function syncMoodleAfterApprovedPayment(payment, logPrefix = "[moodle-sync]") {
  if (!process.env.MOODLE_BASE_URL?.trim() || !process.env.MOODLE_TOKEN?.trim()) {
    console.error(logPrefix, "MOODLE_BASE_URL ou MOODLE_TOKEN ausente no ambiente");
    return { ok: false, reason: "moodle_env" };
  }

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

  console.log(logPrefix, "garantindo usuário Moodle:", email);
  const user = await ensureMoodleUser({
    email,
    firstname: payer.firstname,
    lastname: payer.lastname,
  });

  if (!user?.id) {
    return { ok: false, reason: "no_user_id" };
  }

  console.log(logPrefix, "matriculando userId", user.id, "curso Moodle", moodleCourseId);
  await enrollUserInCourse(user.id, moodleCourseId);
  const enrolled = await isUserEnrolledInCourse(user.id, moodleCourseId);
  return { ok: true, enrolled, userId: user.id, email, moodleCourseId };
}
