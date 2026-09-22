const crypto = require("crypto");

const MERCHANT_ID = "PGTESTPAYUAT";
const SALT_INDEX = "1";
const SALT_KEY = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
const UAT_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

const payload = {
  merchantId: MERCHANT_ID,
  merchantTransactionId: "test_" + Date.now(),
  merchantUserId: "user123",
  amount: 100,
  redirectUrl: "https://example.com",
  redirectMode: "POST",
  callbackUrl: "https://example.com/webhook",
  paymentInstrument: {
    type: "PAY_PAGE",
  },
};

const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");

async function testApi() {
  const stringToHash = base64Payload + "/pg/v1/pay" + SALT_KEY;
  const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
  const checksum = sha256 + "###" + SALT_INDEX;

  try {
    const res = await fetch(UAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": MERCHANT_ID,
      },
      body: JSON.stringify({ request: base64Payload }),
    });
    
    const data = await res.json();
    console.log(`[PGTESTPAYUAT Test] Status: ${res.status} | Response:`, data);
  } catch (err) {
    console.error(`[PGTESTPAYUAT Test] Error:`, err.message);
  }
}

testApi();
