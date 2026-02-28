"use client";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

// ── Inner component (uses useSearchParams) ───────────────────────────────────
function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  useEffect(() => {
    setTokenValid(!!token);
  }, [token]);

  const handleReset = async () => {
    setError("");

    if (!password || !confirmPassword) {
      setError("Both fields are required.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/users/resetpassword", { token, password });
      setSuccess(true);
      setTimeout(() => router.replace("/login"), 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Invalid / missing token ────────────────────────────────────────────
  if (tokenValid === false) {
    return (
      <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-10 max-w-md w-full text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold mb-2">Invalid Reset Link</h2>
        <p className="text-gray-400 text-sm mb-6">
          This password reset link is missing or malformed. Please request a new one.
        </p>
        <button
          onClick={() => router.replace("/forgotpassword")}
          className="px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition"
        >
          Request New Link
        </button>
      </div>
    );
  }

  // ── Success state ──────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-10 max-w-md w-full text-center">
        <div className="text-4xl mb-4">✅</div>
        <h2 className="text-xl font-semibold mb-2">Password Reset!</h2>
        <p className="text-gray-400 text-sm">
          Your password has been updated. Redirecting you to login...
        </p>
      </div>
    );
  }

  // ── Main form ──────────────────────────────────────────────────────────
  return (
    <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-10 max-w-md w-full">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold mb-1">Reset your password</h1>
        <p className="text-gray-400 text-sm">
          Enter a new password for your account.
        </p>
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 bg-red-900/30 border border-red-700 text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1">New Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 8 characters"
          className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-1">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repeat your password"
          className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition"
        />
      </div>

      <button
        onClick={handleReset}
        disabled={loading}
        className="w-full py-2.5 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>

      <p className="mt-5 text-center text-sm text-gray-500">
        Remembered it?{" "}
        <span
          onClick={() => router.replace("/login")}
          className="text-blue-400 cursor-pointer hover:underline"
        >
          Back to Login
        </span>
      </p>
    </div>
  );
}

// ── Fallback shown while searchParams resolves ───────────────────────────────
function ResetPasswordFallback() {
  return (
    <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-10 max-w-md w-full text-center">
      <div className="text-gray-400 text-sm animate-pulse">Loading...</div>
    </div>
  );
}

// ── Page export wraps inner component in Suspense ────────────────────────────
export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <Suspense fallback={<ResetPasswordFallback />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}