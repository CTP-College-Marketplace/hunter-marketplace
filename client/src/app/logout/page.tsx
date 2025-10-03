"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setLoggedIn } from "@/lib/demoAuth";

export default function LogoutPage() {
  const router = useRouter();
  useEffect(() => { setLoggedIn(false); router.replace("/"); }, [router]);
  return null;
}
