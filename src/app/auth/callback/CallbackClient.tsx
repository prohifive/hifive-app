"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CallbackClient() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");

        // OAuth/PKCE の ?code=... を処理
        if (code) {
          await supabase.auth.exchangeCodeForSession(code);
        } else {
          // Magic Link の #access_token=... は SDK が処理（detectSessionInUrl: true）
          await supabase.auth.getSession();
        }
      } catch (e) {
        console.error("callback error:", e);
      } finally {
        router.replace("/dashboard");
      }
    })();
  }, [router]);

  return <main style={{ padding: 16 }}>Signing you in…</main>;
}
