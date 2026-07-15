"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [theme, setTheme] = useState("ocean");
  const [currentUser, setCurrentUser] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = window.localStorage.getItem("theme") || "ocean";
      setTheme(savedTheme);
      const storedUser = window.localStorage.getItem("currentUser");
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch {
          setCurrentUser(null);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("theme", theme);
      document.documentElement.setAttribute("data-theme", theme);
      window.dispatchEvent(new Event("theme:changed"));
    }
  }, [theme]);

  return (
    <div className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-[0_20px_70px_-25px_rgba(15,23,42,0.35)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Settings</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900">Profile & appearance</h2>
        </div>
        <button
          onClick={() => router.back()}
          className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
        >
          Back
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-lg font-semibold text-slate-900">Theme</h3>
          <p className="mt-2 text-sm text-slate-600">Choose how the workspace looks.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {['ocean', 'midnight', 'emerald'].map((item) => (
              <button
                key={item}
                onClick={() => setTheme(item)}
                className={`rounded-2xl border px-4 py-2 text-sm font-semibold capitalize ${theme === item ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-700'}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
