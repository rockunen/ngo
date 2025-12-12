import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export interface EmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(params: EmailParams) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: params.to,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
}

export function generateDonationReceiptHTML(
  donorName: string,
  amount: number,
  date: string,
  transactionId: string,
  organizationName: string = "Save Rana National Trust"
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .details { background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 20px; }
        .amount { font-size: 24px; font-weight: bold; color: #10b981; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🦎 ${organizationName}</h1>
          <p>Donation Receipt</p>
        </div>
        <div class="content">
          <p>Dear <strong>${donorName}</strong>,</p>
          <p>Thank you for your generous donation to ${organizationName}! Your support helps us protect endangered species and their habitats.</p>
          
          <div class="details">
            <p><strong>Amount Donated:</strong> <span class="amount">₹${(
              amount / 100
            ).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span></p>
            <p><strong>Date:</strong> ${new Date(date).toLocaleDateString(
              "en-IN"
            )}</p>
            <p><strong>Transaction ID:</strong> ${transactionId}</p>
          </div>
          
          <p>This donation is eligible for tax benefits under section 80G of the Indian Income Tax Act. A detailed receipt will be mailed to you separately.</p>
          
          <p>For any queries, please contact us at admin@saverana.org</p>
          
          <p>With gratitude,<br><strong>${organizationName}</strong></p>
        </div>
        <div class="footer">
          <p>&copy; 2025 ${organizationName}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
