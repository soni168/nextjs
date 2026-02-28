import bcrypt from "bcryptjs";
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

    // Create hashed token from userId
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    // Store token in DB depending on email type
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

    // Generate correct link based on email type
    const link =
      emailType === "VERIFY"
        ? `${process.env.DOMAIN}/verifyemail?token=${hashedToken}`
        : `${process.env.DOMAIN}/resetpassword?token=${hashedToken}`;

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
        emailType === "VERIFY"
          ? "verify your email"
          : "reset your password"
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