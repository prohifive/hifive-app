"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      try {
        const url = new URL(window.location.href);

        // 1) OAuth の場合: ?code=... が付く
        const code = url.searchParams.get("code");
        if (code) {
          // PKCE のコードをセッションに交換
          await supabase.auth.exchangeCodeForSession({ code });
        } else {
          // 2) Magic Link の場合: #access_token=... が付く
          // createClient で detectSessionInUrl: true にしていれば
          // getSession で取り込みが済む（副作用としてローカル保存される）
          await supabase.auth.getSession();
        }
      } catch {
        // 失敗してもそのままトップへ（そこで再判定）
      } finally {
        // トップへ戻す（トップで /dashboard or /login に振り分け）
        router.replace("/");
      }
    };
    run();
  }, [router]);

  return <p className="p-6 text-sm text-gray-400">Signing you in…</p>;
}
