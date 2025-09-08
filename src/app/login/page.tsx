'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

/** まずは学内ドメインだけ許可。テストで自分のメールを使うなら一時的に 'gmail.com' を追加してOK */
const ALLOWED = ['keio.jp', 'u-tokyo.ac.jp'] // ←必要に応じて増やす

export default function Login() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')

  const send = async () => {
    const domain = (email.split('@')[1] || '').toLowerCase()
    if (!ALLOWED.includes(domain)) {
      setMsg('学内メールのみ利用できます'); return
    }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: typeof window !== 'undefined'
          ? window.location.origin
          : 'http://localhost:3000'
      }
    })
    setMsg(error ? `エラー: ${error.message}` : 'Magic Linkを送りました。メールをご確認ください。')
  }

  return (
    <main className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Hi-Five ログイン</h1>
      <input
        className="border rounded p-2 w-full mb-3"
        placeholder="you@keio.jp"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
      />
      <button onClick={send} className="bg-black text-white rounded p-2 w-full">
        Magic Link送信
      </button>
      <p className="text-sm mt-3">{msg}</p>
    </main>
  )
}
// test change
