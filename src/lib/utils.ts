// Utility functions for form handling and validation

export function formatCurrency(
  amount: number,
  currency: string = "INR"
): string {
  if (currency === "INR") {
    return `₹${amount.toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  }
  return amount.toLocaleString("en-US", { style: "currency", currency });
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ""));
}

export function validatePAN(pan: string): boolean {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
}

export function generateReceiptNumber(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `RCPT-${timestamp}-${random}`;
}

export function calculateDonationProgress(
  current: number,
  target: number
): number {
  if (target === 0) return 0;
  const progress = (current / target) * 100;
  return Math.min(progress, 100);
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}

export function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .map((word) => word[0]?.toUpperCase())
    .join("")
    .substring(0, 2);
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
}

export function calculateImpactMetrics(donationAmount: number) {
  return {
    treesPlanted: Math.floor(donationAmount / 100),
    habitatRestored: Math.floor(donationAmount / 500),
    speciesProtected: Math.floor(donationAmount / 1000),
    studentsReached: Math.floor(donationAmount / 50),
  };
}
