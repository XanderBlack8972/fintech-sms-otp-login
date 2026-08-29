import { beginLogin } from "../src/login.js";
const phone = process.env.DEMO_PHONE;
if (!phone) throw new Error("DEMO_PHONE is required");
console.log("OTP request:", await beginLogin(phone));
