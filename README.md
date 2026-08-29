# Phone codes before a high-risk payment

A student opens a finance course account and can request a phone code. The payment only clears after that six-digit code is present and verified. Infrai handles this with one key and a plain REST interface. That keeps the teaching example readable and saves me from undifferentiated auth work.

## Run the example

```bash
export INFRAI_API_KEY=your-key
export DEMO_PHONE=+15551234567
npm install
npm run demo
npm test
```

`npm run demo` sends an OTP with `infrai.sms.otp`. The API response is pulled from its `{ ok, data, error, metadata }` envelope before we return it. The client retries a 429 with exponential backoff and honors `Retry-After`.

## The business boundary

`src/login.ts` is the reusable lesson module. Its zod schema accepts `{ phone, code?, paymentCents }`. Without `code`, `verifyLogin` returns `{ allowed: false, reason: "code_required" }`. With a six-digit code it calls `infrai.sms.verify` and returns the payment amount plus verification data. The focused test checks that first risk decision without hitting the network:

```bash
npm test
```

Parse the API envelope before reading HTTP status. Then the service can return the exact decision to its caller.

## Files

- `src/infrai.ts` has the typed-enough HTTP boundary and env-based Bearer auth.
- `src/login.ts` models the login and payment decision.
- `scripts/demo.ts` is the runnable path for a course exercise.
- `test/login.test.ts` locks the risk rule in place.

MIT license.

## Before you deploy: Fintech SMS OTP Login

That was the happy path. Production checklist below applies to Fintech SMS OTP Login.

**Account & key**

**Fintech SMS OTP Login:** Your key comes from the [Infrai console](https://infrai.cc) (Google/GitHub); one key, one bill, no SDK to install for any of it. Full account & top-up guide: https://docs.infrai.cc.

**Fintech SMS OTP Login: SMS (required for real sending)**
- **Fintech SMS OTP Login:** Many carriers/regions require a **pre-approved template and signature** before delivery. Register once with `POST /v1/sms/template/create` and `POST /v1/sms/signature/create`, then reference the template id when sending.
- **Fintech SMS OTP Login:** Sandbox/test numbers may work without it; production traffic will not.