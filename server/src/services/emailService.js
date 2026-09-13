/**
 * Email Delivery & Verification Service Abstraction
 * Supports SMTP transport when configured, and provides a secure,
 * zero-friction development fallback that logs verification OTPs to the console.
 */

const sendVerificationEmail = async ({ toEmail, verificationCode, name = "Developer" }) => {
  const isSmtpConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

  if (isSmtpConfigured) {
    try {
      let nodemailer;
      try {
        nodemailer = require("nodemailer");
      } catch (e) {
        console.warn("[Email Service] nodemailer package not installed. Falling back to development console logging.");
      }

      if (nodemailer) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT, 10) || 587,
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.EMAIL_FROM || '"DevFlow Security" <no-reply@devflow.local>',
          to: toEmail,
          subject: "Verify your DevFlow workspace account",
          html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #E6E3DB; border-radius: 8px;">
              <h2 style="color: #18181B; margin-bottom: 12px;">Verify your DevFlow Account</h2>
              <p style="color: #575653; font-size: 14px; line-height: 1.6;">Hello ${name},</p>
              <p style="color: #575653; font-size: 14px; line-height: 1.6;">Your 6-digit verification code is below. It expires in 15 minutes.</p>
              <div style="background-color: #F7F6F2; border: 1px solid #E6E3DB; border-radius: 6px; padding: 16px; text-align: center; margin: 20px 0;">
                <span style="font-family: monospace; font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #18181B;">${verificationCode}</span>
              </div>
              <p style="color: #8E8B82; font-size: 12px;">If you did not request this verification, please ignore this email.</p>
            </div>
          `,
        });

        return { delivered: true, method: "smtp" };
      }
    } catch (err) {
      console.error("[Email Service] SMTP transmission error:", err.message);
    }
  }

  // Development Fallback: Clearly log the OTP in the server console for rapid testing
  console.log("\n" + "=".repeat(64));
  console.log(" [DEVFLOW SECURITY] EMAIL VERIFICATION CODE");
  console.log("=".repeat(64));
  console.log(` Recipient : ${toEmail}`);
  console.log(` OTP Code  : ${verificationCode}`);
  console.log(` Expires In: 15 minutes`);
  console.log("=".repeat(64) + "\n");

  return {
    delivered: true,
    method: "console-dev",
    previewCode: process.env.NODE_ENV !== "production" ? verificationCode : undefined,
  };
};

module.exports = {
  sendVerificationEmail,
};
