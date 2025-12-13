import { z } from "zod";

// Donation form schema
export const donationFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().optional(),
  amount: z.number().min(1, "Amount must be greater than 0"),
  message: z
    .string()
    .max(500, "Message must be less than 500 characters")
    .optional(),
  panNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
});

export type DonationFormData = z.infer<typeof donationFormSchema>;

// Database types for Supabase
export interface Donor {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  pan_number?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  receive_newsletter: boolean;
  created_at: string;
  updated_at: string;
}

export interface Donation {
  id: string;
  donor_id: string;
  amount: number;
  currency: string;
  message?: string;
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  status: "pending" | "completed" | "failed";
  receipt_sent: boolean;
  created_at: string;
  updated_at: string;
}

export interface DonationReceipt {
  id: string;
  donation_id: string;
  receipt_number: string;
  receipt_url?: string;
  sent_at?: string;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  target_amount: number;
  current_amount: number;
  status: "active" | "completed" | "paused";
  created_at: string;
  updated_at: string;
}
