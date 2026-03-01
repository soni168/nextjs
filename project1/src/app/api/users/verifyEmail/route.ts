import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/helpers/mailer";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    await connect(); // ✅ await added

    const reqBody = await request.json();
    const { token, resend } = reqBody;

    // ── Resend verification email ──────────────────────────────────────
    if (resend) {
      const user = await User.findOne({ email: resend });

      if (!user) {
        // ✅ generic message — email enumeration se bachao
        return NextResponse.json({
          message: "If email exists, verification link sent",
        });
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

    // ── Verify token ───────────────────────────────────────────────────
    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    // ✅ Hash incoming raw token before DB lookup
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      verifyToken: hashedToken, // ✅ hashed token se match
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    user.isVerified = true;
    user.verifyToken = null;          
    user.verifyTokenExpiry = null;    
    await user.save();

    return NextResponse.json({
      message: "Email verified successfully",
      success: true,
    });

  } catch (error: any) {
    console.error("Verify email error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, // ✅ error.message expose nahi
      { status: 500 }
    );
  }
}