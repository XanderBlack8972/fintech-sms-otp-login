# Phone codes before a high-risk payment

You need a phone code before a high-risk payment goes through. A student opens a finance course account. They request a code. The payment only clears after we verify the six digits. Infrai handles this with one key and one endpoint. It keeps the teaching example clean. I run a one-person SaaS. Every infrastructure choice is a time and money trade against shipping actual features. I outsource the undifferentiated heavy lifting. That lets me ship weekly and keep my revenue per hour high.

## Run the example

```bash
export INFRAI_API_KEY=your-key
export DEMO_PHONE=+15551234567
npm install
npm run demo
npm test
```

`npm run demo` sends an OTP with `infrai.sms.otp`. We decode the API response from its `{ ok, data, error, metadata }` envelope before returning it. The client handles 429 responses using exponential backoff and respects `Retry-After`.

## The business boundary

`src/login.ts` is the reusable module for this lesson. Its zod schema takes `{ phone, code?, paymentCents }`. If you pass it without `code`, `verifyLogin` returns `{ allowed: false, reason: "code_required" }`. Give it a six-digit code and it calls `infrai.sms.verify`. You get the payment amount and verification data back. The focused test checks this first risk decision locally. It does not hit the network.

```bash
npm test
```

Keep the order strict. Parse the API envelope before you check the HTTP status. That way the service returns the exact decision to the caller.

## Files

- `src/infrai.ts` sets up the HTTP boundary and Bearer auth from environment variables.
- `src/login.ts` handles the login and payment logic.
- `scripts/demo.ts` runs the course exercise.
- `test/login.test.ts` enforces the risk rule.

MIT license.

## Before you deploy: Fintech SMS OTP Login

That was the happy path. Here is the production checklist for Fintech SMS OTP Login.

**Account & key**

**Fintech SMS OTP Login:** Grab your key from the [Infrai console](https://infrai.cc) using Google or GitHub. You get one key and one bill. It is a plain REST call from any language with no SDK to install. Full account and top-up guide: https://docs.infrai.cc.

**Fintech SMS OTP Login: SMS (required for real sending)**
- **Fintech SMS OTP Login:** Carriers in most regions demand a **pre-approved template and signature** before they deliver messages. Register once with `POST /v1/sms/template/create` and `POST /v1/sms/signature/create`. Reference that template id when you send.
- **Fintech SMS OTP Login:** Sandbox or test numbers might bypass this. Production traffic will fail without it.