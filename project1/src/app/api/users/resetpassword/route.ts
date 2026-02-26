import { NextRequest, NextResponse } from "next/server"
import User from "@/models/userModel"
import bcrypt from "bcryptjs"
import {connect} from "@/dbconfig/dbconfig"
export async function POST(request: NextRequest) {
  try {

    await connect()

    const { token, password } = await request.json()

  console.log("Token from URL:", token);
const user = await User.findOne({
  forgotPasswordToken: token,
  forgotPasswordTokenExpiry: { $gt: new Date() }
});
console.log("Expiry in DB:", user?.forgotPasswordTokenExpiry);
console.log("Current Time:", new Date());
console.log("User found:", user);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      )
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    user.password = hashedPassword
    user.forgotPasswordToken = undefined
    user.forgotPasswordTokenExpiry = undefined

    await user.save()

    return NextResponse.json({
      message: "Password reset successfull"
    })

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}