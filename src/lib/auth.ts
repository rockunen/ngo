import { supabase, supabaseServer } from "./supabase";
import { z } from "zod";

// Validation schemas
export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone must be at least 10 digits").optional(),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Invalid password"),
});

export const managerSignInSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export type SignUpData = z.infer<typeof signUpSchema>;
export type SignInData = z.infer<typeof signInSchema>;
export type ManagerSignInData = z.infer<typeof managerSignInSchema>;

// Auth service functions
export const authService = {
  // Sign up new user
  async signUp(data: SignUpData) {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            phone: data.phone,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("User creation failed");

      // Create user profile in database
      const { error: profileError } = await supabase.from("users").insert({
        id: authData.user.id,
        email: data.email,
        full_name: data.fullName,
        phone: data.phone,
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (profileError) throw profileError;

      return { success: true, user: authData.user };
    } catch (error) {
      throw error;
    }
  },

  // Sign in user
  async signIn(data: SignInData) {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;
      return { success: true, user: authData.user };
    } catch (error) {
      throw error;
    }
  },

  // Sign out user
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    } catch {
      return null;
    }
  },

  // Get user profile
  async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  async updateUserProfile(
    userId: string,
    updates: Partial<{
      full_name: string;
      phone: string;
      avatar_url: string;
    }>
  ) {
    try {
      const { data, error } = await supabase
        .from("users")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Reset password
  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
      });
      if (error) throw error;
      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  // Update password
  async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      return { success: true };
    } catch (error) {
      throw error;
    }
  },
};

// Manager auth service
export const managerAuthService = {
  // Manager sign in
  async signIn(data: ManagerSignInData) {
    try {
      const { email, password } = data;

      const { data: manager, error } = await supabaseServer()
        .from("managers")
        .select("*")
        .eq("email", email)
        .eq("is_active", true)
        .single();

      if (error) {
        console.error("Database query error:", error);
        throw new Error("Invalid email or password");
      }

      if (!manager) {
        console.error("Manager not found for email:", email);
        throw new Error("Invalid email or password");
      }

      console.log("Manager found:", { email: manager.email, id: manager.id });
      console.log("Password comparison:", {
        storedHash: manager.password_hash,
        providedPassword: password,
        match: manager.password_hash === password,
      });

      // Simple password comparison (in production, use bcrypt)
      if (manager.password_hash !== password) {
        throw new Error("Invalid email or password");
      }

      return {
        success: true,
        manager: {
          id: manager.id,
          email: manager.email,
          full_name: manager.full_name,
        },
      };
    } catch (error) {
      console.error("Manager sign in error:", error);
      throw error;
    }
  },

  // Get manager profile
  async getManager(managerId: string) {
    try {
      const { data, error } = await supabaseServer()
        .from("managers")
        .select("id, email, full_name, is_active, created_at")
        .eq("id", managerId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },
};
