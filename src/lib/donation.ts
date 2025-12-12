import { supabaseServer } from "./supabase";
import { z } from "zod";

// Validation schemas
export const createDonationSchema = z.object({
  donor_id: z.string().uuid(),
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().default("INR"),
  donation_type: z.enum(["oneTime", "monthly"]).default("oneTime"),
  project_id: z.string().uuid().optional().nullable(),
  message: z.string().optional().nullable(),
});

export type CreateDonationInput = z.infer<typeof createDonationSchema>;

// Donation service
export const donationService = {
  // Create a new donation
  async createDonation(input: CreateDonationInput) {
    try {
      const supabase = supabaseServer();
      const amountInPaise = Math.round(input.amount * 100);

      const { data, error } = await supabase
        .from("donations")
        .insert([
          {
            donor_id: input.donor_id,
            amount: amountInPaise,
            currency: input.currency,
            donation_type: input.donation_type,
            project_id: input.project_id,
            message: input.message,
            status: "pending",
            receipt_sent: false,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Create payment record
  async createPayment(donationId: string, razorpayOrderId: string) {
    try {
      const supabase = supabaseServer();

      const { data, error } = await supabase
        .from("payments")
        .insert([
          {
            donation_id: donationId,
            razorpay_order_id: razorpayOrderId,
            status: "pending",
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Verify and update payment
  async verifyPayment(
    paymentId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ) {
    try {
      const supabase = supabaseServer();

      // Update payment record
      const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .update({
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: razorpaySignature,
          status: "completed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", paymentId)
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Update donation status
      const { data: donation, error: donationError } = await supabase
        .from("donations")
        .update({
          status: "completed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", payment.donation_id)
        .select()
        .single();

      if (donationError) throw donationError;

      return payment;
    } catch (error) {
      throw error;
    }
  },

  // Get donation history for a user
  async getDonationHistory(userId: string, limit: number = 50) {
    try {
      const supabase = supabaseServer();

      const { data, error } = await supabase
        .from("donations")
        .select(
          `
          id,
          amount,
          currency,
          donation_type,
          message,
          status,
          created_at,
          projects(id, title),
          donors(id, full_name, email)
        `
        )
        .eq("status", "completed")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw error;
    }
  },

  // Get donation statistics
  async getDonationStats(userId?: string) {
    try {
      const supabase = supabaseServer();

      let query = supabase
        .from("donations")
        .select("amount, donation_type, status, created_at", {
          count: "exact",
        })
        .eq("status", "completed");

      const { data, count, error } = await query;

      if (error) throw error;

      const donations = data || [];
      const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
      const monthlyCount = donations.filter(
        (d) => d.donation_type === "monthly"
      ).length;
      const oneTimeCount = donations.filter(
        (d) => d.donation_type === "oneTime"
      ).length;

      return {
        totalDonations: count || 0,
        totalAmount: totalAmount / 100, // Convert from paise to rupees
        monthlyDonors: monthlyCount,
        oneTimeDonors: oneTimeCount,
        averageDonation:
          donations.length > 0 ? totalAmount / donations.length / 100 : 0,
      };
    } catch (error) {
      throw error;
    }
  },

  // Get donations for a specific project
  async getProjectDonations(projectId: string) {
    try {
      const supabase = supabaseServer();

      const { data, error } = await supabase
        .from("donations")
        .select(
          `
          id,
          amount,
          currency,
          donation_type,
          message,
          status,
          created_at,
          donors(full_name, email)
        `
        )
        .eq("project_id", projectId)
        .eq("status", "completed")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw error;
    }
  },

  // Get project funding progress
  async getProjectProgress(projectId: string) {
    try {
      const supabase = supabaseServer();

      const { data: project, error } = await supabase
        .from("projects")
        .select("id, title, target_amount, current_amount")
        .eq("id", projectId)
        .single();

      if (error) throw error;

      const donations = await this.getProjectDonations(projectId);
      const totalRaised = donations.reduce((sum, d) => sum + d.amount, 0) / 100;

      return {
        ...project,
        totalRaised,
        percentage: (totalRaised / project.target_amount) * 100,
        donorCount: donations.length,
      };
    } catch (error) {
      throw error;
    }
  },

  // Update project amount after successful donation
  async updateProjectAmount(projectId: string, amount: number) {
    try {
      const supabase = supabaseServer();

      const { data: project, error: fetchError } = await supabase
        .from("projects")
        .select("current_amount, target_amount")
        .eq("id", projectId)
        .single();

      if (fetchError) throw fetchError;

      const newAmount = project.current_amount + amount / 100; // Convert from paise

      const { data, error: updateError } = await supabase
        .from("projects")
        .update({
          current_amount: newAmount,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId)
        .select()
        .single();

      if (updateError) throw updateError;
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get donation receipt
  async getDonationReceipt(donationId: string) {
    try {
      const supabase = supabaseServer();

      const { data, error } = await supabase
        .from("donation_receipts")
        .select("*")
        .eq("donation_id", donationId)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data || null;
    } catch (error) {
      throw error;
    }
  },

  // Create donation receipt
  async createReceipt(
    donationId: string,
    receiptUrl: string,
    receiptNumber: string
  ) {
    try {
      const supabase = supabaseServer();

      const { data, error } = await supabase
        .from("donation_receipts")
        .insert([
          {
            donation_id: donationId,
            receipt_number: receiptNumber,
            receipt_url: receiptUrl,
            sent_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },
};
