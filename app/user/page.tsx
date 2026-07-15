"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import UserDashboard from "../components/AdminDashboard";

export default function Admin() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "user") {
      router.push("/");
    }
  }, []);

  return <UserDashboard />;
}