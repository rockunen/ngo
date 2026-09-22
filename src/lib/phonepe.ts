import crypto from "crypto";

const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || "PGTESTPAYUAT";
const SALT_KEY = process.env.PHONEPE_SALT_KEY || "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
const WEBHOOK_SALT_KEY = process.env.PHONEPE_WEBHOOK_SALT_KEY || SALT_KEY;
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX || "1";
const ENV = process.env.PHONEPE_ENV || "UAT"; // UAT or PROD

const PHONEPE_HOST_URL =
  ENV === "PROD"
    ? "https://api.phonepe.com/apis/hermes"
    : "https://api-preprod.phonepe.com/apis/pg-sandbox";

// Validate donation amount (min ₹500, max ₹100,000)
const MIN_DONATION_AMOUNT = 50000; // ₹500 in paise
const MAX_DONATION_AMOUNT = 10000000; // ₹100,000 in paise

export function validateDonationAmount(amountInPaise: number): boolean {
  return amountInPaise >= MIN_DONATION_AMOUNT && amountInPaise <= MAX_DONATION_AMOUNT;
}

export interface PhonePePayload {
  merchantId: string;
  merchantTransactionId: string;
  merchantUserId: string;
  amount: number; // in paise
  redirectUrl: string;
  redirectMode: string;
  callbackUrl: string;
  mobileNumber?: string;
  paymentInstrument: {
    type: "PAY_PAGE";
  };
}

export async function createPhonePeOrder(params: {
  amount: number;
  transactionId: string;
  userId: string;
  mobileNumber?: string;
  returnUrl: string;
  callbackUrl: string;
}) {
  const payload: PhonePePayload = {
    merchantId: MERCHANT_ID,
    merchantTransactionId: params.transactionId,
    merchantUserId: params.userId.replace(/-/g, ""), // Remove hyphens to keep under 35 char limit
    amount: params.amount,
    redirectUrl: params.returnUrl,
    redirectMode: "POST", // PhonePe will POST back to our returnUrl
    callbackUrl: params.callbackUrl,
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  if (params.mobileNumber && /^[0-9]{10}$/.test(params.mobileNumber)) {
    payload.mobileNumber = params.mobileNumber;
  }

  const base64EncodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64");
  
  // SHA256(Base64EncodedPayload + "/pg/v1/pay" + salt key) + ### + salt index
  const stringToHash = base64EncodedPayload + "/pg/v1/pay" + SALT_KEY;
  const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
  const checksum = sha256 + "###" + SALT_INDEX;

  const url = `${PHONEPE_HOST_URL}/pg/v1/pay`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      "X-MERCHANT-ID": MERCHANT_ID,
    },
    body: JSON.stringify({
      request: base64EncodedPayload,
    }),
  });

  const data = await response.json();
  if (data.success) {
    return {
      redirectUrl: data.data.instrumentResponse.redirectInfo.url,
      transactionId: params.transactionId,
    };
  } else {
    console.error("PhonePe API Error Response:", data);
    throw new Error(data.message || "Failed to initiate PhonePe payment");
  }
}

export async function checkPhonePeTransactionStatus(merchantTransactionId: string) {
  // SHA256(“/pg/v1/status/{merchantId}/{merchantTransactionId}” + saltKey) + "###" + saltIndex
  const stringToHash = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}${SALT_KEY}`;
  const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
  const checksum = sha256 + "###" + SALT_INDEX;

  const url = `${PHONEPE_HOST_URL}/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      "X-MERCHANT-ID": MERCHANT_ID,
    },
  });

  return await response.json();
}

export function verifyPhonePeSignature(base64Body: string, signature: string | null): boolean {
  if (!signature) return false;
  
  try {
    const expectedHash = crypto.createHash('sha256').update(base64Body + WEBHOOK_SALT_KEY).digest('hex');
    const expectedSignature = expectedHash + "###" + SALT_INDEX;
    return signature === expectedSignature;
  } catch (error) {
    console.error("PhonePe signature verification error:", error);
    return false;
  }
}
