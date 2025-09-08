"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        await supabase.auth.exchangeCodeForSession(window.location.href);
      } finally {
        router.replace("/dashboard");
      }
    })();
  }, [router]);

  return <main className="p-6">Signing you in…</main>;
}
