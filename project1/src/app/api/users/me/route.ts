import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbconfig/dbconfig";

export async function GET(request: NextRequest) {
  try {
    await connect(); // ✅ moved inside handler

    const userId = await getDataFromToken(request);

    // ✅ guard against missing/invalid token data
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing token" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ _id: userId }).select("-password");

    // ✅ handle deleted or non-existent user
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "User found",
      data: user,
    });

  } catch (error: any) {
    // ✅ differentiate token errors from server errors
    const isAuthError = error.message?.toLowerCase().includes("token") ||
                        error.message?.toLowerCase().includes("unauthorized");

    return NextResponse.json(
      { error: error.message },
      { status: isAuthError ? 401 : 500 }
    );
  }
}