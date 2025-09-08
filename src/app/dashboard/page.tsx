'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/src/lib/supabase'
import { getSession } from '@/src/lib/session'

const SLOTS = [
  { key: 'now', label: '今から' },
  { key: 'lunch', label: '昼時' },
  { key: 'after3rd', label: '3限後' }
]
const CATEGORIES = [
  { key: 'random', label: 'ランダム' },
  { key: 'same-grade', label: '同学年' },
  { key: 'hobby', label: '趣味' }
]

export default function Dashboard() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [slot, setSlot] = useState('now')
  const [cat, setCat] = useState('random')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    (async () => {
      const session = await getSession()
      if (!session) { router.push('/login'); return }
      const { data } = await supabase.from('profiles')
        .select('display_name').eq('id', session.user.id).maybeSingle()
      if (!data) { router.replace('/onboard'); return }
      setName(data.display_name ?? '')
    })()
  }, [router])

  const submit = async () => {
    setSubmitting(true)
    const session = await getSession()
    if (!session) return
    await supabase.from('availabilities').insert({
      user_id: session.user.id,
      slot, category: cat
    })
    setSubmitting(false)
    alert('エントリーしました！(暫定)')  // 後で「成立保証」ロジックに繋ぐ
  }

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <main className="max-w-lg mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Hi-Five</h1>
        <button onClick={logout} className="text-sm underline">ログアウト</button>
      </div>

      <p className="text-gray-600">ようこそ、{name || 'Student'} さん</p>

      <section className="space-y-3">
        <h2 className="font-semibold">いつ？</h2>
        <div className="flex gap-2">
          {SLOTS.map(s => (
            <button key={s.key}
              onClick={() => setSlot(s.key)}
              className={`border rounded px-3 py-2 ${slot===s.key?'bg-black text-white':''}`}>
              {s.label}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">カテゴリー</h2>
        <div className="flex gap-2">
          {CATEGORIES.map(c => (
            <button key={c.key}
              onClick={() => setCat(c.key)}
              className={`border rounded px-3 py-2 ${cat===c.key?'bg-black text-white':''}`}>
              {c.label}
            </button>
          ))}
        </div>
      </section>

      <button
        onClick={submit}
        disabled={submitting}
        className="bg-black text-white rounded p-3 w-full">
        今日ヒマを出す
      </button>
    </main>
  )
}
