"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const go = async () => {
      const { data } = await supabase.auth.getSession();
      router.replace(data.session ? "/dashboard" : "/login");
    };
    go();
  }, [router]);

  return null;
}
