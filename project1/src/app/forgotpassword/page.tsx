"use client";
import axios from "axios";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const sendResetLink = async () => {
    if (!email) return toast.error("Please enter your email");
    setLoading(true);

    try {
      await axios.post("/api/users/forgotpassword", { email });
      setIsSent(true);
      toast.success("Reset link sent successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 text-slate-900">
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200 w-full max-w-md">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-2xl mb-4 text-blue-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Reset Password</h2>
          <p className="text-slate-500 mt-2">
            {isSent 
              ? "Check your inbox for further instructions" 
              : "Enter your email to receive a recovery link"}
          </p>
        </div>

        {!isSent ? (
          <div className="space-y-6">
            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all disabled:opacity-60"
              />
            </div>

            {/* Action Button */}
            <button
              onClick={sendResetLink}
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
                  Sending Link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </div>
        ) : (
          /* Success State UI */
          <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl text-center space-y-4">
            <div className="text-blue-600 text-sm font-medium">
              We've sent a password reset link to <br />
              <span className="font-bold text-blue-800">{email}</span>
            </div>
            <button 
              onClick={() => setIsSent(false)} 
              className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider"
            >
              Didn't get it? Try again
            </button>
          </div>
        )}

        {/* Back to Login Section */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <Link 
            href="/login" 
            className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}