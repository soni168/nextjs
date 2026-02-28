import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connect } from "@/dbconfig/dbconfig";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    // ✅ stronger minimum length
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // ✅ hash the incoming token before DB lookup (matches hashed value at rest)
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      forgotPasswordToken: hashedToken,
      forgotPasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // ✅ pass rounds directly — no need to manually genSalt
    user.password = await bcrypt.hash(password, 12);

    // ✅ use null instead of undefined to reliably clear Mongoose fields
    user.forgotPasswordToken = null;
    user.forgotPasswordTokenExpiry = null;

    await user.save();

    return NextResponse.json({
      message: "Password reset successfully",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}