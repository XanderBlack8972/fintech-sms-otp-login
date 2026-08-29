import { z } from "zod";
import { infrai } from "./infrai.js";

export const loginBody = z.object({ phone: z.string().min(8), code: z.string().regex(/^\d{6}$/).optional(), paymentCents: z.number().int().nonnegative() });
export type LoginInput = z.infer<typeof loginBody>;

export async function beginLogin(phone: string) {
  return infrai.sms.otp(phone, "fintech-login");
}

export async function verifyLogin(input: unknown) {
  const parsed = loginBody.parse(input);
  if (!parsed.code) return { allowed: false, reason: "code_required" as const };
  const verification = await infrai.sms.verify(parsed.phone, parsed.code);
  return { allowed: true, paymentCents: parsed.paymentCents, verification };
}
