import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-slate-900">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-10 text-center">
        
        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-6 shadow-lg shadow-blue-200">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Welcome</h1>
        <p className="text-slate-500 mb-10">Sign in to your account or create a new one to get started.</p>

        <div className="space-y-3">
          <Link
            href="/login"
            className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-100 text-center"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="block w-full py-3 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-all text-center"
          >
            Create Account
          </Link>
        </div>
      </div>

      <footer className="mt-8 text-slate-400 text-xs">
        &copy; 2026 Soni Chaudhary
      </footer>
    </div>
  );
}