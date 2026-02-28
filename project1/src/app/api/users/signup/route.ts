import { connect } from "@/dbconfig/dbconfig";
import { NextResponse, NextRequest } from "next/server";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const { username, email, password } = await request.json();

    // ✅ validate all required fields upfront
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email, and password are required" },
        { status: 400 }
      );
    }

    // ✅ basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // ✅ enforce minimum password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // ✅ check both email and username for duplicates
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      const field = existingUser.email === email ? "Email" : "Username";
      return NextResponse.json(
        { error: `${field} is already taken` },
        { status: 400 }
      );
    }

    // ✅ pass rounds directly — no need for genSalt
    const hashedPassword = await bcrypt.hash(password, 12);

    const savedUser = await new User({
      username,
      email,
      password: hashedPassword,
    }).save();

    await sendEmail({
      email,
      emailType: "VERIFY",
      userId: savedUser._id,
    });

    // ✅ never return the full user object — strip sensitive fields
    return NextResponse.json(
      {
        message: "User created successfully",
        data: {
          id: savedUser._id,
          username: savedUser.username,
          email: savedUser.email,
        },
      },
      { status: 201 } // ✅ 201 Created is correct for resource creation
    );

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}