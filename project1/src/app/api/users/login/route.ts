import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // check user
    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json({ error: "User does not exist" }, { status: 400 });

    // check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });

    // create token
    const tokenData = { id: user._id, username: user.username, email: user.email };
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1d" });

    // ✅ Option 1: set httpOnly cookie (secure)
    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });



    return response;

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}