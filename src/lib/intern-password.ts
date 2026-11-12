import crypto from "crypto";

export const MIN_INTERN_PASSWORD_LENGTH = 6;
export const MAX_INTERN_PASSWORD_LENGTH = 128;

export function hashInternPassword(password: string) {
  return crypto
    .createHash("sha256")
    .update(password + (process.env.INTERN_PASSWORD_SALT || "default_salt"))
    .digest("hex");
}
