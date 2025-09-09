export default function Debug() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return (
    <main style={{padding:20, color:'#0f0'}}>
      <h1>/debug</h1>
      <p>URL: {url ? url : 'undefined'}</p>
      <p>ANON len: {key ? key.length : 'undefined'}</p>
    </main>
  );
}
