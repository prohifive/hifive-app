'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/src/lib/supabase'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        router.replace('/dashboard') // ログイン済み → ダッシュボード
      } else {
        router.replace('/login')     // 未ログイン → ログイン画面
      }
    }
    checkSession()
  }, [router])

  return null
}
