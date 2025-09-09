"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // 本番でもローカルでも、そのドメインの /auth/callback に戻す
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      setMsg("Magic Link を送りました。メールのリンクをクリックしてください。");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "ログインに失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-md rounded-xl border border-neutral-700 p-6">
        <h1 className="text-2xl font-semibold mb-4">ログイン</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <label className="block text-sm">
            メールアドレス
            <input
              type="email"
              required
              className="mt-1 w-full rounded border border-neutral-600 bg-transparent p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-white/10 px-4 py-2 hover:bg-white/20 disabled:opacity-60"
          >
            {loading ? "送信中..." : "Magic Link を送る"}
          </button>
        </form>
        {msg && <p className="mt-4 text-sm opacity-80">{msg}</p>}
      </div>
    </main>
  );
}
