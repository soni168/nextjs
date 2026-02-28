import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// ✅ type your token payload instead of using any
interface TokenPayload {
  id: string;
  username: string;
  email: string;
  iat: number;
  exp: number;
}

export const getDataFromToken = (req: NextRequest): string => {
  // ✅ guard against missing secret at startup
  const secret = process.env.TOKEN_SECRET;
  if (!secret) {
    throw new Error("TOKEN_SECRET is not configured");
  }

  // ✅ handle missing token explicitly
  const token = req.cookies.get("token")?.value;
  if (!token) {
    throw new Error("No token provided");
  }

  try {
    const decoded = jwt.verify(token, secret) as TokenPayload;
    return decoded.id;
  } catch (err) {
    // ✅ rethrow original error to preserve type (TokenExpiredError, etc.)
    throw err;
  }
};