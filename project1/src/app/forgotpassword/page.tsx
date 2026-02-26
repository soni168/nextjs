"use client"
import axios from "axios"
import { useState } from "react"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const sendResetLink = async () => {
    if (!email) return alert("Please enter your email")
    setLoading(true)
    setMessage("")

    try {
      const response = await axios.post("/api/users/forgotpassword", { email })
      setMessage(response.data.message || "Reset link sent! Check your email.")
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl mb-4">Forgot Password</h2>
      
      <input 
        type="email" 
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border px-4 py-2 rounded mb-2"
      />
      
      <button
        onClick={sendResetLink}
        disabled={loading}
        className={`px-6 py-2 rounded text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </button>

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  )
}