import Link from "next/link";
import { Plus } from "lucide-react";

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Home Inventory</h1>
          <p className="text-slate-500">Manage your home inventory and factory orders</p>
        </div>
        <Link
          href="/dashboard/inventory/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Add Home
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No homes in inventory</h3>
        <p className="text-slate-500 mb-6">Add your first home to get started</p>
        <Link
          href="/dashboard/inventory/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Add Home
        </Link>
      </div>
    </div>
  );
}
