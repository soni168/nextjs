import nodemailer from "nodemailer";
import User from "@/models/userModel";
import crypto from "crypto";

// ✅ typed parameters
interface SendEmailParams {
  email: string;
  userId: string;
  emailType: "VERIFY" | "RESET";
}

// ✅ transporter created once, not on every call
const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

export const sendEmail = async ({ email, userId, emailType }: SendEmailParams) => {
  // ✅ validate required env vars before doing any work
  const domain = process.env.DOMAIN;
  const fromEmail = process.env.FROM_EMAIL;
  if (!domain || !fromEmail) {
    throw new Error("DOMAIN or FROM_EMAIL environment variable is not set");
  }

  // ✅ validate emailType explicitly
  if (emailType !== "VERIFY" && emailType !== "RESET") {
    throw new Error(`Invalid emailType: ${emailType}`);
  }

  // ✅ generate raw token to send in the link
  const rawToken = crypto.randomBytes(32).toString("hex");

  // ✅ hash before storing in DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  // ✅ store hashed token
  if (emailType === "VERIFY") {
    await User.findByIdAndUpdate(userId, {
      verifyToken: hashedToken,
      verifyTokenExpiry: Date.now() + 3600000,
    });
  } else {
    await User.findByIdAndUpdate(userId, {
      forgotPasswordToken: hashedToken,
      forgotPasswordTokenExpiry: Date.now() + 3600000,
    });
  }

  // ✅ send RAW token in the link — user presents it, we hash & compare
  const link =
    emailType === "VERIFY"
      ? `${domain}/verifyemail?token=${rawToken}`
      : `${domain}/resetpassword?token=${rawToken}`;

  const isVerify = emailType === "VERIFY";

  const mailOptions = {
    from: fromEmail, // ✅ from env variable, not hardcoded
    to: email,
    subject: isVerify ? "Verify your email" : "Reset your password",
    html: `
      <p>
        Click <a href="${link}">here</a> to ${isVerify ? "verify your email" : "reset your password"}.
        <br/>
        Or copy and paste this link into your browser:
        <br/>
        <a href="${link}">${link}</a>
      </p>
      <p>This link expires in 1 hour.</p>
    `,
  };

  try {
    return await transport.sendMail(mailOptions);
  } catch (error) {
    // ✅ rethrow original error to preserve type
    throw error;
  }
};