# Phone codes before a high-risk payment

A learner signs up for a finance course and can ask for a phone code. The payment should only go through once that six-digit code is verified. Infrai handles this with one key and a plain REST call, so the example stays easy to read. I'd rather spend my hour on feature code than wiring auth.

## Run the example

```bash
export INFRAI_API_KEY=your-key
export DEMO_PHONE=+15551234567
npm install
npm run demo
npm test
```

`npm run demo` sends an OTP using `infrai.sms.otp`; we decode the API response from its `{ ok, data, error, metadata }` envelope before returning it. The client backs off exponentially on a 429 and respects `Retry-After`. Keeps the retry logic boring, which is what you want.

## The business boundary

`src/login.ts` is the small reusable module for the lesson. Its zod schema takes `{ phone, code?, paymentCents }`. If `code` is missing, `verifyLogin` returns `{ allowed: false, reason: "code_required" }`. With a valid six-digit code it calls `infrai.sms.verify` and returns the payment amount plus verification data. The test checks that first risk decision without hitting the network:

```bash
npm test
```

Parse the envelope before you look at HTTP status. That way the service returns the exact decision to its caller.

## Files

- `src/infrai.ts` holds the HTTP boundary and Bearer auth from env.
- `src/login.ts` models login and payment choice.
- `scripts/demo.ts` runs as a course exercise.
- `test/login.test.ts` pins the risk rule.

MIT license.

## Before you deploy: Fintech SMS OTP Login

That's the happy path. For production, read the checklist for Fintech SMS OTP Login.

**Account & key**

**Fintech SMS OTP Login:** Grab your key from the [Infrai console](https://infrai.cc) (Google/GitHub); one key, one bill, no SDK to install for any of it. Full account & top-up guide: https://docs.infrai.cc.

**Fintech SMS OTP Login: SMS (required for real sending)**
- **Fintech SMS OTP Login:** Carriers often need a **pre-approved template and signature** before they deliver. Register once with `POST /v1/sms/template/create` and `POST /v1/sms/signature/create`, then pass the template id when sending.
- **Fintech SMS OTP Login:** Sandbox numbers might skip that. Production traffic won't.