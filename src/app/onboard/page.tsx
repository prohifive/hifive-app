"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Onboard() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [grade, setGrade] = useState<string>("");
  const [interests, setInterests] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? "");
    };
    run();
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          email: user.email,
          display_name: displayName,
          grade,
          interests
        });
      if (error) throw error;
      router.replace("/dashboard");
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "保存に失敗しました。");
    } finally {
      setSaving(false);
    }
  };

  const onChangeDisplayName = (e: React.ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value);
  const onChangeGrade = (e: React.ChangeEvent<HTMLInputElement>) => setGrade(e.target.value);
  const onChangeInterests = (e: React.ChangeEvent<HTMLInputElement>) => setInterests(e.target.value);

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">初回プロフィール登録</h1>
      <p className="text-sm text-gray-500 mb-4">{email}</p>

      <label className="block mb-2">表示名</label>
      <input className="border p-2 w-full mb-4" value={displayName} onChange={onChangeDisplayName} />

      <label className="block mb-2">学年（例: B1 / M1）</label>
      <input className="border p-2 w-full mb-4" value={grade} onChange={onChangeGrade} />

      <label className="block mb-2">興味（カンマ区切り）</label>
      <input className="border p-2 w-full mb-6" placeholder="coffee, debate, startup" value={interests} onChange={onChangeInterests} />

      <button onClick={saveProfile} disabled={saving} className="border px-4 py-2 rounded">
        {saving ? "保存中..." : "保存してダッシュボードへ"}
      </button>
    </main>
  );
}
