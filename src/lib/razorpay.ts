import Razorpay from "razorpay";

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

export async function createRazorpayOrder(params: RazorpayOrderParams) {
  try {
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

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const crypto = require("crypto");
  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  hmac.update(orderId + "|" + paymentId);
  const generated_signature = hmac.digest("hex");
  return generated_signature === signature;
}
