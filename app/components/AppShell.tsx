"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const baseNavLinks = [{ label: "Home", href: "/" }];
const themeClasses = {
  ocean: {
    shell: "from-sky-50 via-white to-indigo-100 text-slate-800",
    header: "border-slate-200/70 bg-white/85 text-slate-800",
    footer: "border-slate-200/70 bg-white/70 text-slate-600",
    pill: "bg-slate-900 text-white",
  },
  midnight: {
    shell: "from-slate-950 via-slate-900 to-slate-800 text-slate-100",
    header: "border-slate-700/70 bg-slate-900/90 text-slate-100",
    footer: "border-slate-700/70 bg-slate-900/70 text-slate-300",
    pill: "bg-slate-100 text-slate-900",
  },
  emerald: {
    shell: "from-emerald-950 via-emerald-900 to-emerald-800 text-slate-100",
    header: "border-emerald-700/70 bg-emerald-900/90 text-slate-100",
    footer: "border-emerald-700/70 bg-emerald-900/70 text-slate-300",
    pill: "bg-emerald-100 text-emerald-900",
  },
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [theme, setTheme] = useState("ocean");
  const [currentUser, setCurrentUser] = useState<{ name?: string; email?: string; role?: string } | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = window.localStorage.getItem("theme") || "ocean";
      setTheme(savedTheme);
      setRole(window.localStorage.getItem("role"));

      try {
        const storedUser = window.localStorage.getItem("currentUser");
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
      } catch {
        setCurrentUser(null);
      }

      const syncTheme = () => {
        const nextTheme = window.localStorage.getItem("theme") || "ocean";
        setTheme(nextTheme);
      };

      window.addEventListener("theme:changed", syncTheme);
      return () => window.removeEventListener("theme:changed", syncTheme);
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("theme", theme);
      document.documentElement.setAttribute("data-theme", theme);
      window.dispatchEvent(new Event("theme:changed"));
    }
  }, [theme]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("role");
      window.localStorage.removeItem("currentUser");
    }
    setRole(null);
    setCurrentUser(null);
    setProfileOpen(false);
    router.push("/");
  };

  const handleSettingsClick = () => {
    setProfileOpen(false);
    router.push("/settings");
  };

  const navLinks =
    role === "admin"
      ? [...baseNavLinks, { label: "Admin", href: "/admin" }]
      : role === "user"
        ? [...baseNavLinks, { label: "My Credentials", href: "/user" }]
        : baseNavLinks;

  return (
    <div className={`min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_30%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_100%)] bg-gradient-to-br ${themeClasses[theme as keyof typeof themeClasses].shell}`}>
      <header className={`relative z-[100] isolate border-b backdrop-blur ${themeClasses[theme as keyof typeof themeClasses].header}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-xl shadow-lg shadow-blue-200">
              🔐
            </div>
            <div>
              <p className="text-lg font-semibold tracking-wide">
                Exdion Vault
              </p>
              <p className="text-xs opacity-70">Premium credential portal</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium opacity-90 md:flex">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition ${active ? "font-semibold underline decoration-blue-500 underline-offset-4" : "hover:opacity-80"}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {role ? (
              <div className="relative z-[10000]">
                <button
                  onClick={() => setProfileOpen((open) => !open)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white/80 shadow-sm transition hover:bg-white"
                  aria-label="Open profile menu"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-sm font-semibold text-white">
                    {currentUser?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 z-[10001] w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                    <div className="rounded-xl bg-slate-50 px-3 py-3">
                      <p className="text-sm font-semibold text-slate-900">{currentUser?.name || "Signed in user"}</p>
                      <p className="text-xs text-slate-500">{currentUser?.email || "Secure access"}</p>
                    </div>

                    <div className="mt-2 space-y-1">
                      <button className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        <span>Username</span>
                        <span className="text-xs text-slate-400">{currentUser?.name || "User"}</span>
                      </button>
                      <button
                        onClick={handleSettingsClick}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <span>Settings</span>
                        <span className="text-xs text-slate-400">Profile</span>
                      </button>
                      <button className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        <span>Version</span>
                        <span className="text-xs text-slate-400">v1.0</span>
                      </button>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="mt-2 w-full rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/"
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className={`border-t px-4 py-6 text-center text-sm backdrop-blur ${themeClasses[theme as keyof typeof themeClasses].footer}`}>
        <p>© 2026 Exdion Vault • Secure credential access for your team</p>
      </footer>
    </div>
  );
}
