"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import UserDashboard from "../components/UserDashboard";

export default function UserPage() {
  const router = useRouter();

  useEffect(() => {
    const role = window.localStorage.getItem("role");

    if (role !== "user") {
      router.push("/");
    }
  }, [router]);

  return <UserDashboard />;
}