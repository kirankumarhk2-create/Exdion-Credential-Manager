"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

const handleLogin = () => {
  setError("");

  if (username === "admin" && password === "admin123") {
    localStorage.setItem("role", "admin");
    router.push("/admin");
    return;
  }

  if (username === "user" && password === "user123") {
    localStorage.setItem("role", "user");
    router.push("/user");
    return;
  }

  setError("Invalid Username or Password");
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold">
          Login
        </h1>

        {/* Username */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Username
          </label>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Password
          </label>

          <div className="flex">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 rounded-l-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="rounded-r-lg border border-l-0 border-gray-300 px-4"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="mb-4 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700"
        >
          Login
        </button>
      </div>
    </div>
  );
}