import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          FDHC DMS
        </h1>
        <p className="text-xl text-slate-300 mb-8">
          Manufactured Housing Dealership Management System
        </p>
        <div className="space-x-4">
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Enter Dashboard
          </Link>
          <Link
            href="/desking"
            className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Desking Matrix
          </Link>
        </div>
      </div>
    </div>
  );
}
