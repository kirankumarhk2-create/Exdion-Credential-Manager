"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminDashboard from "../components/AdminDashboard";

export default function Admin() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "admin") {
      router.push("/");
    }
  }, []);

  return <AdminDashboard />;
}