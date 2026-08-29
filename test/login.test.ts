import test from "node:test";
import assert from "node:assert/strict";
import { verifyLogin } from "../src/login.js";

test("a payment cannot proceed until a six digit code is supplied", async () => {
  const result = await verifyLogin({ phone: "+15551234567", paymentCents: 4200 });
  assert.deepEqual(result, { allowed: false, reason: "code_required" });
});
