"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

function toMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  try { return JSON.stringify(e); } catch { return "ログインに失敗しました。"; }
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/` },
      });
      if (error) throw error;
      setMsg("Magic Link を送りました。メールのリンクをクリックしてください。");
    } catch (err: unknown) {
      setMsg(toMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">ログイン</h1>
      <form onSubmit={handleLogin}>
        <label className="block mb-2">メールアドレス</label>
        <input
          type="email"
          required
          className="border p-2 w-full mb-4"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <button type="submit" disabled={loading} className="border px-4 py-2 rounded">
          {loading ? "送信中..." : "Magic Linkを送る"}
        </button>
      </form>
      {msg && <p className="mt-4 text-sm text-gray-600">{msg}</p>}
    </main>
  );
}
