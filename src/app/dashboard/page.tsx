"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const SLOTS = [
  { key: "now", label: "今から" },
  { key: "lunch", label: "昼休み" },
  { key: "after3rd", label: "3限後" },
] as const;

export default function Dashboard() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) { router.replace("/login"); return; }
      setEmail(data.session.user.email ?? "");
    };
    run();
  }, [router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold mb-2">Dashboard</h1>
      <p className="mb-6">こんにちは {email}</p>

      <div className="flex gap-2 mb-6">
        {SLOTS.map((s) => (
          <span key={s.key} className="border rounded px-2 py-1 text-sm">{s.label}</span>
        ))}
      </div>

      <button onClick={signOut} className="border px-4 py-2 rounded">サインアウト</button>
    </main>
  );
}
