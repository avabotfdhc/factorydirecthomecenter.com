"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      }}
      className="px-3 py-1.5 text-sm rounded-lg border border-white/20 text-white/80 hover:bg-white/10 transition-colors"
    >
      Sign Out
    </button>
  );
}
