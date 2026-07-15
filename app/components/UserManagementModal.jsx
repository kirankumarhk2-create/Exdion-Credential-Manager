"use client";

import { useEffect, useState } from "react";

const blankUser = {
  username: "",
  password: "",
  name: "",
  email: "",
  role: "user",
  status: "approved",
};

export default function UserManagementModal({ isOpen, onClose, onCreate }) {
  const [formData, setFormData] = useState(blankUser);

  useEffect(() => {
    if (!isOpen) {
      setFormData(blankUser);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.username || !formData.password || !formData.name || !formData.email) {
      return;
    }

    onCreate?.({
      id: Date.now(),
      ...formData,
      status: formData.status || "approved",
    });
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Create access</p>
            <h3 className="mt-1 text-2xl font-semibold text-slate-900">Add a new app user</h3>
          </div>
          <button onClick={onClose} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Full name</label>
              <input value={formData.name} onChange={(e) => handleChange("name", e.target.value)} className="w-full rounded-2xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
              <input value={formData.email} onChange={(e) => handleChange("email", e.target.value)} className="w-full rounded-2xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Username</label>
              <input value={formData.username} onChange={(e) => handleChange("username", e.target.value)} className="w-full rounded-2xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
              <input value={formData.password} onChange={(e) => handleChange("password", e.target.value)} className="w-full rounded-2xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Role</label>
              <select value={formData.role} onChange={(e) => handleChange("role", e.target.value)} className="w-full rounded-2xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Approval</label>
              <select value={formData.status} onChange={(e) => handleChange("status", e.target.value)} className="w-full rounded-2xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500">
                <option value="approved">Approved</option>
                <option value="pending">Pending approval</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-2xl bg-slate-100 px-4 py-2 font-semibold text-slate-700">Cancel</button>
          <button onClick={handleSubmit} className="rounded-2xl bg-blue-600 px-4 py-2 font-semibold text-white">Create user</button>
        </div>
      </div>
    </div>
  );
}
