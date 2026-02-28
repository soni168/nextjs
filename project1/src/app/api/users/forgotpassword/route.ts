import { NextResponse } from "next/server";
import {connect} from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(req: Request) {
  try {

    const { email } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({
        message: "If email exists, reset link sent",
      });
    }

    await sendEmail({
      email: email,
      emailType: "RESET",
      userId: user._id,
    });

    return NextResponse.json({ message: "Reset link sent to your email" });
  } catch (error: any) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}