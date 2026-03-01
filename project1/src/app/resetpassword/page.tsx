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
      <div className="bg-white border border-slate-200 rounded-2xl p-10 max-w-md w-full text-center shadow-sm">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-red-50 rounded-2xl mb-4">
          <span className="text-3xl">⚠️</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Invalid Reset Link</h2>
        <p className="text-slate-500 text-sm mb-6">
          This password reset link is missing or malformed. Please request a new one.
        </p>
        <button
          onClick={() => router.replace("/forgotpassword")}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-100"
        >
          Request New Link
        </button>
      </div>
    );
  }

  // ── Success state ──────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden max-w-md w-full shadow-sm text-center">
        <div className="bg-blue-600 p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
            <span className="text-3xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Password Reset!</h2>
        </div>
        <div className="p-8">
          <p className="text-slate-500 text-sm">
            Your password has been updated. Redirecting you to login...
          </p>
        </div>
      </div>
    );
  }

  // ── Main form ──────────────────────────────────────────────────────────
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden max-w-md w-full shadow-sm">
      {/* Header */}
      <div className="bg-blue-600 p-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-500 rounded-2xl mb-4 border-4 border-blue-400/30">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white">Reset Password</h1>
        <p className="text-blue-100 text-sm mt-1">Enter a new password for your account</p>
      </div>

      {/* Form */}
      <div className="p-8 space-y-5">
        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-100 text-red-500 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
            New Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat your password"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
          />
        </div>

        <button
          onClick={handleReset}
          disabled={loading}
          className={`w-full py-4 rounded-xl font-bold transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 ${
            loading
              ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100"
          }`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              Resetting...
            </>
          ) : (
            "Reset Password"
          )}
        </button>

        <div className="pt-4 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-600">
            Remembered it?{" "}
            <span
              onClick={() => router.replace("/login")}
              className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
            >
              Back to Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Fallback shown while searchParams resolves ───────────────────────────────
function ResetPasswordFallback() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-10 max-w-md w-full text-center shadow-sm">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>
  );
}

// ── Page export wraps inner component in Suspense ────────────────────────────
export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center px-6">
      <Suspense fallback={<ResetPasswordFallback />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}