'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/src/lib/supabase'
import { getSession } from '@/src/lib/session'
import { useRouter } from 'next/navigation'

export default function Onboard() {
  const router = useRouter()
  const [displayName, setDisplayName] = useState('')
  const [grade, setGrade] = useState('')
  const [interests, setInterests] = useState<string>('') // カンマ区切り入力
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState<string>('')

  useEffect(() => {
    (async () => {
      const session = await getSession()
      if (!session) { router.push('/login'); return }
      setEmail(session.user.email ?? '')
      // 既存プロフィールがあればダッシュボードへ
      const { data } = await supabase.from('profiles')
        .select('id').eq('id', session.user.id).maybeSingle()
      if (data) router.replace('/dashboard')
    })()
  }, [router])

  const save = async () => {
    setLoading(true)
    const session = await getSession()
    if (!session) return
    const tags = interests
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)

    const { error } = await supabase.from('profiles').upsert({
      id: session.user.id,
      email,
      display_name: displayName,
      grade,
      interests: tags
    })
    setLoading(false)
    if (!error) router.push('/dashboard')
    else alert(error.message)
  }

  return (
    <main className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">プロフィール登録</h1>
      <p className="text-sm text-gray-500 mb-4">{email}</p>

      <label className="block mb-2">表示名</label>
      <input className="border p-2 w-full mb-4"
        value={displayName} onChange={(e) => setDisplayName(e.target.value)} />

      <label className="block mb-2">学年（例: B1 / M1 など）</label>
      <input className="border p-2 w-full mb-4"
        value={grade} onChange={(e) => setGrade(e.target.value)} />

      <label className="block mb-2">興味（カンマ区切り）</label>
      <input className="border p-2 w-full mb-6"
        placeholder="coffee, debate, startup"
        value={interests} onChange={(e) => setInterests(e.target.value)} />

      <button
        onClick={save}
        disabled={loading}
        className="bg-black text-white rounded p-2 w-full"
      >
        保存してはじめる
      </button>
    </main>
  )
}
