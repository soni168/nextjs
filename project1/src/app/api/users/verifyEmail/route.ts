import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token, resend } = reqBody;

    console.log("verifyemail body:", reqBody);

    if (resend) {
  const user = await User.findOne({ email: resend });

  if (!user) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 400 }
    );
  }

  if (user.isVerified) {
    return NextResponse.json({
      message: "Email already verified",
    });
  }

  await sendEmail({
    email: user.email,
    emailType: "VERIFY",
    userId: user._id,
  });

  return NextResponse.json({
    message: "Verification link sent",
    success: true,
  });
}


    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({
      message: "Email verified successfully",
      success: true,
    });
  } catch (error: any) {
    console.error("Verify email error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}