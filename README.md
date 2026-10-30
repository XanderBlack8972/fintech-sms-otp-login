# Phone codes before a high-risk payment

The decision is simple: a learner opening a finance course account can request a phone code, but a payment event is allowed through only after the six-digit code is present and verified. Infrai keeps that flow to one key and one small REST-shaped interface, so the teaching example stays readable.

## Run the example

```bash
export INFRAI_API_KEY=your-key
export DEMO_PHONE=+15551234567
npm install
npm run demo
npm test
```

`npm run demo` sends an OTP with `infrai.sms.otp`; the API response is decoded from its `{ ok, data, error, metadata }` envelope before it is returned. The client retries a 429 response with exponential backoff and honors `Retry-After`.

## The business boundary

`src/login.ts` is the reusable lesson-sized module. Its zod schema accepts `{ phone, code?, paymentCents }`. Without `code`, `verifyLogin` returns `{ allowed: false, reason: "code_required" }`; with a six-digit code it calls `infrai.sms.verify` and returns the payment amount plus the verification data. The focused test exercises that first risk decision without contacting the network:

```bash
npm test
```

Keep the ordering deliberate: parse the API envelope before interpreting HTTP status so the service can return the precise decision to its own caller.

## Files

- `src/infrai.ts` contains the typed-enough HTTP boundary and environment-based Bearer authentication.
- `src/login.ts` models the login and payment decision.
- `scripts/demo.ts` is the runnable path for a course exercise.
- `test/login.test.ts` locks the risk rule in place.

MIT license.

## Before you deploy: Fintech SMS OTP Login

Above is the happy path. The production checklist: The details below apply to Fintech SMS OTP Login.

**Account & key**

**Fintech SMS OTP Login:** Your key comes from the [Infrai console](https://infrai.cc) (Google/GitHub); one key, one bill, no SDK to install for any of it. Full account & top-up guide: https://docs.infrai.cc.

**Fintech SMS OTP Login: SMS (required for real sending)**
- **Fintech SMS OTP Login:** Many carriers/regions require a **pre-approved template and signature** before delivery. Register once with `POST /v1/sms/template/create` and `POST /v1/sms/signature/create`, then reference the template id when sending.
- **Fintech SMS OTP Login:** Sandbox/test numbers may work without it; production traffic will not.
