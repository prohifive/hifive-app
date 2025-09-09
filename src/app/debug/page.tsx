/** @type {import("react").FC} */
// サーバーコンポーネント（デフォルト）
export default function DebugEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "(missing)";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "present" : "(missing)";

  return (
    <main style={{padding: 24, fontFamily: "sans-serif"}}>
      <h1 style={{fontSize: 20, fontWeight: "bold"}}>/debug</h1>
      <p>URL: <code>{url}</code></p>
      <p>ANON KEY: <code>{anon}</code></p>
      <p style={{marginTop:16,opacity:.7}}>
        ※ ここに表示されるのは <code>NEXT_PUBLIC_</code> で始まる値のみ（本番ではビルド時に埋め込まれます）
      </p>
    </main>
  );
}
