import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "@/models/userModel";

export const sendEmail = async ({
  email,
  emailType,
  userId,
}: {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: string;
}) => {
  try {
    if (!email) {
      throw new Error("Email is required in sendEmail");
    }

    // ✅ URL-safe raw token — yeh email link mein jayega
    const rawToken = crypto.randomBytes(32).toString("hex");

    // ✅ Hashed token — yeh DB mein store hoga
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    // ✅ Store hashed token in DB
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000, // 1 hour
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000, // 1 hour
      });
    }

    // ✅ Raw token goes in URL (not hashed)
    const link =
      emailType === "VERIFY"
        ? `${process.env.DOMAIN}/verifyemail?token=${rawToken}`
        : `${process.env.DOMAIN}/resetpassword?token=${rawToken}`;

    // Create transport
    const transport = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: email,
      subject:
        emailType === "VERIFY"
          ? "Verify your email"
          : "Reset your password",
      html: `
        <p>
          Click <a href="${link}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      }.
        </p>
        <p>
          Or copy and paste this link in your browser:<br/>
          ${link}
        </p>
      `,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    console.log("Email sent:", mailResponse.messageId);

    return mailResponse;
  } catch (error: any) {
    console.error("Mailer Error:", error);
    throw new Error(error.message);
  }
};