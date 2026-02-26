import crypto from "crypto"
import User from "@/models/userModel"
import { sendEmail } from "@/helpers/mailer"
import { NextRequest } from "next/server"
export async function POST(request: NextRequest) {

  const { email } = await request.json()

  // 1️⃣ Find user
  const user = await User.findOne({ email })

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
    })
  }

  // 2️⃣ Generate token
  const token = crypto.randomBytes(32).toString("hex")

  // 3️⃣ Save token in DB
  user.forgotPasswordToken = token
  user.forgotPasswordTokenExpiry = Date.now() + 3600000

  await user.save()

  // 4️⃣ Send email
  await sendEmail({
     email,
     emailType: "RESET",
     userId: user._id
  })

  return new Response(JSON.stringify({ message: "Password reset email sent" }), {
    status: 200,
  })
}