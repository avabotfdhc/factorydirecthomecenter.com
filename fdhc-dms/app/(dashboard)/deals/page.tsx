import Link from "next/link";
import { Plus } from "lucide-react";

export default function DealsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Deals</h1>
          <p className="text-slate-500">Track and manage your deals</p>
        </div>
        <Link
          href="/dashboard/deals/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          New Deal
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No deals yet</h3>
        <p className="text-slate-500 mb-6">Create your first deal to get started</p>
        <Link
          href="/dashboard/deals/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Create Deal
        </Link>
      </div>
    </div>
  );
}
