import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

if (
  !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
  !process.env.RAZORPAY_KEY_SECRET
) {
  throw new Error("Missing Razorpay credentials");
}

export default razorpay;

export interface RazorpayOrderParams {
  amount: number; // in paise (amount * 100)
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

// Validate donation amount (min ₹1, max ₹100,000)
const MIN_DONATION_AMOUNT = 1;
const MAX_DONATION_AMOUNT = 10000000; // ₹100,000 in paise

export function validateDonationAmount(amountInPaise: number): boolean {
  return (
    amountInPaise >= MIN_DONATION_AMOUNT && amountInPaise <= MAX_DONATION_AMOUNT
  );
}

export async function createRazorpayOrder(params: RazorpayOrderParams) {
  try {
    // Validate amount
    if (!validateDonationAmount(params.amount)) {
      throw new Error(
        `Invalid amount. Must be between ₹${MIN_DONATION_AMOUNT / 100} and ₹${
          MAX_DONATION_AMOUNT / 100
        }`
      );
    }

    const order = await razorpay.orders.create({
      amount: params.amount,
      currency: params.currency || "INR",
      receipt: params.receipt,
      notes: params.notes,
    });
    return order;
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    throw error;
  }
}

// Secure signature verification with timing attack protection
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  try {
    const hmac = crypto.createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET || ""
    );
    hmac.update(orderId + "|" + paymentId);
    const generated_signature = hmac.digest("hex");

    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(generated_signature),
      Buffer.from(signature)
    );
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}
