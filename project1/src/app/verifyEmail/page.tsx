"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const verifyUserEmail = useCallback(async (tok: string) => {
        try {
            setLoading(true);
            await axios.post('/api/users/verifyemail', { token: tok });
            setVerified(true);
            setError(false);
        } catch (error: any) {
            setError(true);
            console.log(error.response?.data);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const urlToken = searchParams.get("token");
        setToken(urlToken || "");
    }, [searchParams]);

    useEffect(() => {
        if (token.length > 0) {
            verifyUserEmail(token);
        }
    }, [token, verifyUserEmail]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-slate-900">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden text-center">
                
                {/* Visual Header */}
                <div className={`p-10 ${error ? 'bg-red-50' : 'bg-blue-600'}`}>
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-sm mb-4">
                        {loading ? (
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : verified ? (
                            <span className="text-3xl">✅</span>
                        ) : error ? (
                            <span className="text-3xl">❌</span>
                        ) : (
                            <span className="text-3xl text-blue-600 font-bold">!</span>
                        )}
                    </div>
                    <h1 className={`text-2xl font-bold ${error ? 'text-red-700' : 'text-white'}`}>
                        {verified ? "Email Verified" : error ? "Verification Failed" : "Verifying Email"}
                    </h1>
                </div>

                {/* Content */}
                <div className="p-8">
                    {!verified && !error && (
                        <p className="text-slate-500">
                            Please wait while we validate your account credentials...
                        </p>
                    )}

                    {verified && (
                        <div className="space-y-4">
                            <p className="text-slate-600">
                                Your account is now active. You can proceed to the login page.
                            </p>
                            <Link 
                                href="/login"
                                className="inline-block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-md shadow-blue-100"
                            >
                                Go to Login
                            </Link>
                        </div>
                    )}

                    {error && (
                        <div className="space-y-4">
                            <p className="text-slate-600 bg-red-50 p-3 rounded-lg text-sm border border-red-100">
                                The link may be expired or the token is invalid.
                            </p>
                            <Link 
                                href="/signup"
                                className="inline-block w-full py-3 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-lg transition-all"
                            >
                                Try Signing Up Again
                            </Link>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-2">
                            Session Token
                        </span>
                        <code className="text-xs p-2 bg-slate-50 rounded border border-slate-100 text-blue-600 block truncate">
                            {token ? token : "No token detected"}
                        </code>
                    </div>
                </div>
            </div>
            
            <footer className="mt-8 text-slate-400 text-sm">
                &copy; 2026 Your Project Identity
            </footer>
        </div>
    );
}

export default function VerifyEmailPageWrapper() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <VerifyEmailPage />
        </Suspense>
    );
}