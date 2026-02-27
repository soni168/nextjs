"use client";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const router = useRouter();
    const [data, setData] = useState("nothing");
    const [loading, setLoading] = useState(false);

    const logout = async () => {
        try {
            setLoading(true);
            await axios.get('/api/users/logout');
            toast.success('Logout successful');
            router.push('/login');
        } catch (error: any) {
            console.log(error.message);
            toast.error("Logout failed");
        } finally {
            setLoading(false);
        }
    }

    const getUserDetails = async () => {
        try {
            const res = await axios.get('/api/users/me');
            setData(res.data.data._id);
            toast.success("User data synced");
        } catch (error: any) {
            toast.error("Failed to fetch user details");
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-900 p-6">
            {/* Main Card Container */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                
                {/* Header Section */}
                <div className="bg-blue-600 p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4 border-4 border-blue-400/30">
                        <span className="text-white text-2xl font-bold">
                            {data !== 'nothing' ? "✓" : "?"}
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">User Profile</h1>
                    <p className="text-blue-100 text-sm mt-1">Manage your secure session</p>
                </div>

                {/* Content Section */}
                <div className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Account Identifier
                        </label>
                        <div className="flex items-center justify-center p-4 bg-slate-50 border border-slate-100 rounded-xl min-h-15">
                            {data === 'nothing' ? (
                                <span className="text-slate-400 italic">No record found</span>
                            ) : (
                                <Link 
                                    href={`/profile/${data}`}
                                    className="text-blue-600 hover:text-blue-800 font-mono font-medium transition-colors underline decoration-blue-200 underline-offset-4"
                                >
                                    {data}
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={getUserDetails}
                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-md shadow-blue-100 active:scale-[0.98]"
                        >
                            Fetch User Details
                        </button>
                        
                        <button
                            onClick={logout}
                            disabled={loading}
                            className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 font-semibold rounded-lg transition-all disabled:opacity-50"
                        >
                            {loading ? "Processing..." : "Log Out"}
                        </button>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-400">
                        Protected by Industry Standard Encryption
                    </p>
                </div>
            </div>
            
            <p className="mt-8 text-slate-400 text-sm">
                Need help? <span className="text-blue-500 cursor-pointer hover:underline">Contact Support</span>
            </p>
        </div>
    );
}