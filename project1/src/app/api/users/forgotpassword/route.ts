import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import User from "@/models/userModel";
import { sendEmail } from "@/helpers/mailer";
import { connect } from "@/dbconfig/dbconfig";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    // Return generic message to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message: "If that email exists, a reset link has been sent.",
        success: true,
      });
    }

    // Generate a raw token to send in the email link
    const rawToken = crypto.randomBytes(32).toString("hex");

    // Hash the token before storing in DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.forgotPasswordToken = hashedToken;
    user.forgotPasswordTokenExpiry = Date.now() + 3600000; // 1 hour

    await user.save();

    // Pass the RAW token to the email so the link contains the unhashed version
    await sendEmail({
      email,
      emailType: "RESET",
      userId: user._id,
      token: rawToken, // ← update your sendEmail helper to accept & use this
    });

    return NextResponse.json({
      message: "If that email exists, a reset link has been sent.",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}