"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPassword({ searchParams }: any) {
  const router = useRouter();

  // safer token handling
  const token =
    typeof searchParams?.token === "string"
      ? searchParams.token
      : "";

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetPassword = async () => {
    if (!token) {
      setError("Invalid or missing token.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter a new password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.post("/api/users/resetpassword", {
        token,
        password,
      });

      alert(response.data.message || "Password reset successfully!");
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Reset Password
        </h2>

        {error && (
          <p className="text-red-500 mb-4 text-center">{error}</p>
        )}

        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg"
          disabled={loading}  
        />

        <button
          onClick={resetPassword}
          disabled={loading}  
          className={`w-full py-2 rounded-lg font-medium text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
}