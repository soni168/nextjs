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

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.forgotPasswordToken = token;
    user.forgotPasswordTokenExpiry = Date.now() + 3600000;

    await user.save();

    await sendEmail({
      email,
      emailType: "RESET",
      userId: user._id,
    });

    return NextResponse.json({
      message: "Password reset email sent",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}