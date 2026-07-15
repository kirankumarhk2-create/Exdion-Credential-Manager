"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AppUser = {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  role: string;
  status?: string;
};

const seededUsers: AppUser[] = [
  { id: 1, username: "admin", password: "admin123", name: "Kiran Kumar HK", email: "kiran@exdion.com", role: "admin", status: "approved" },
  { id: 2, username: "user", password: "user123", name: "Asha R", email: "asha@exdion.com", role: "user", status: "approved" },
];

const readUsers = (): AppUser[] => {
  if (typeof window === "undefined") {
    return seededUsers;
  }

  try {
    const storedUsers = window.localStorage.getItem("appUsers");
    if (storedUsers) {
      return JSON.parse(storedUsers);
    }
  } catch {
    // fall back to seeded values
  }

  window.localStorage.setItem("appUsers", JSON.stringify(seededUsers));
  return seededUsers;
};

export default function Home() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [requestName, setRequestName] = useState("");
  const [requestEmail, setRequestEmail] = useState("");
  const [error, setError] = useState("");
  const [requestMessage, setRequestMessage] = useState("");

  const handleLogin = () => {
    setError("");
    setRequestMessage("");

    const users = readUsers();
    const matchedUser = users.find(
      (user) => user.username === username.trim() && user.password === password
    );

    if (matchedUser) {
      if (matchedUser.status === "pending") {
        setError("Your access request is still pending admin approval.");
        return;
      }

      window.localStorage.setItem("role", matchedUser.role);
      window.localStorage.setItem("currentUser", JSON.stringify(matchedUser));
      router.push(matchedUser.role === "admin" ? "/admin" : "/user");
      return;
    }

    setError("Invalid username or password.");
  };

  const handleRequestAccess = () => {
    setError("");
    setRequestMessage("");

    const trimmedUsername = username.trim();
    const trimmedName = requestName.trim();
    const trimmedEmail = requestEmail.trim();

    if (!trimmedName || !trimmedEmail || !trimmedUsername || !password) {
      setError("Please complete your name, email, username, and password.");
      return;
    }

    const users = readUsers();
    const existingUser = users.find((user) => user.username.toLowerCase() === trimmedUsername.toLowerCase());

    if (existingUser) {
      setError("That username is already in use.");
      return;
    }

    const pendingUser = {
      id: Date.now(),
      username: trimmedUsername,
      password,
      name: trimmedName,
      email: trimmedEmail,
      role: "user",
      status: "pending",
    };

    const nextUsers = [pendingUser, ...users];
    window.localStorage.setItem("appUsers", JSON.stringify(nextUsers));
    setUsername("");
    setPassword("");
    setRequestName("");
    setRequestEmail("");
    setRequestMessage("Your access request was sent. An admin can approve it from the dashboard.");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <section className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-8 shadow-[0_20px_70px_-30px_rgba(37,99,235,0.45)] backdrop-blur sm:p-10">
        <div className="mb-6 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
          Secure • Modern • Fast
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Manage credentials with confidence.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-slate-600">
          Welcome to Exdion Vault, a polished credential workspace for admins and users to review access, status, and account details in one place.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Demo accounts</p>
            <p>Admin: admin / admin123</p>
            <p>User: user / user123</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Included</p>
            <p>Header, footer, role-based dashboard</p>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200/70 bg-white/90 p-8 shadow-[0_20px_70px_-25px_rgba(15,23,42,0.35)] backdrop-blur sm:p-10">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-semibold text-slate-900">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-500">Sign in to continue to your workspace.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <div className="flex rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 rounded-l-2xl bg-transparent px-4 py-3 text-slate-800 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="rounded-r-2xl px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
          {requestMessage && <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{requestMessage}</p>}

          <button
            onClick={handleLogin}
            className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:translate-y-[-1px] hover:shadow-xl"
          >
            Sign in
          </button>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-3 text-sm font-semibold text-slate-800">New user? Request access</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Your name"
                value={requestName}
                onChange={(e) => setRequestName(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
              <input
                type="email"
                placeholder="Your email"
                value={requestEmail}
                onChange={(e) => setRequestEmail(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleRequestAccess}
              className="mt-3 w-full rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Request access
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}