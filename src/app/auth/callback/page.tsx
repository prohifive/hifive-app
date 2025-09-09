"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const go = async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");

        // ✅ Supabase v2 は string を渡します（オブジェクトではない）
        //    Magic Link でも ?code=... で来る場合はこれでOK。
        //    ハッシュ(#access_token=...)パターンは createClient の
        //    detectSessionInUrl:true が処理します。
        if (code) {
          await supabase.auth.exchangeCodeForSession(code);
        }
      } catch (e) {
        console.error("callback error:", e);
      } finally {
        router.replace("/dashboard");
      }
    };
    go();
  }, [router]);

  return <main style={{ padding: 16 }}>Signing you in…</main>;
}
