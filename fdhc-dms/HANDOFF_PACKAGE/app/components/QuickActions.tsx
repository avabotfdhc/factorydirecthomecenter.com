import Link from "next/link";
import { Plus, Phone, Calculator, Home } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      name: "New Lead",
      href: "/dashboard/leads/new",
      icon: Plus,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "Log Call",
      href: "#",
      icon: Phone,
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      name: "Desking",
      href: "/desking",
      icon: Calculator,
      color: "bg-emerald-600 hover:bg-emerald-700",
    },
    {
      name: "Add Home",
      href: "/dashboard/inventory/new",
      icon: Home,
      color: "bg-purple-600 hover:bg-purple-700",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action) => (
        <Link
          key={action.name}
          href={action.href}
          className={`${action.color} text-white p-4 rounded-xl flex items-center gap-3 transition-colors`}
        >
          <action.icon size={20} />
          <span className="font-medium">{action.name}</span>
        </Link>
      ))}
    </div>
  );
}
