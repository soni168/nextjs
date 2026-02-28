import { connect } from "@/dbconfig/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    // ✅ hash the incoming token before DB lookup
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      verifyToken: hashedToken,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // ✅ skip if already verified
    if (user.isVerified) {
      return NextResponse.json(
        { message: "Email is already verified", success: true }
      );
    }

    user.isVerified = true;
    user.verifyToken = null;         // ✅ null reliably clears Mongoose fields
    user.verifyTokenExpiry = null;   // ✅ same here
    await user.save();

    return NextResponse.json({
      message: "Email verified successfully",
      success: true,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}