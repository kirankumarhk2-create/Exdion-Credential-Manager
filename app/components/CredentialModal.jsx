"use client";

import { useEffect, useState } from "react";

const blankCredential = {
  id: "",
  name: "",
  email: "",
  password: "",
  description: "",
};

export default function CredentialModal({ isOpen, mode, credential, onClose, onSave, onDelete }) {
  const [formData, setFormData] = useState(blankCredential);

  useEffect(() => {
    if (credential) {
      setFormData(credential);
    } else {
      setFormData(blankCredential);
    }
  }, [credential, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave?.(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              {mode === "view" ? "Credential details" : mode === "edit" || mode === "add" ? "Manage credential" : "Delete credential"}
            </p>
            <h3 className="mt-1 text-2xl font-semibold text-slate-900">
              {credential?.name || "Credential"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600 transition hover:bg-slate-200"
          >
            ✕
          </button>
        </div>

        {mode === "view" && (
          <div className="space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">Service / App</p>
              <p className="mt-1 font-semibold text-slate-900">{credential?.name}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">Username</p>
              <p className="mt-1 font-semibold text-slate-900">{credential?.email}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">Password</p>
              <p className="mt-1 font-semibold text-slate-900">{credential?.password}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">Notes</p>
              <p className="mt-1 font-semibold text-slate-900">{credential?.description}</p>
            </div>
          </div>
        )}

        {(mode === "edit" || mode === "add") && (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Service / App</label>
              <input
                value={formData.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Username</label>
              <input
                value={formData.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
              <input
                value={formData.password || ""}
                onChange={(e) => handleChange("password", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Notes</label>
              <textarea
                value={formData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {mode === "delete" && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <p className="font-semibold">This will permanently remove this credential from the list.</p>
            <p className="mt-2">Are you sure you want to delete {credential?.name}?</p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button onClick={onClose} className="rounded-2xl bg-slate-100 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-200">
            {mode === "delete" ? "Cancel" : "Close"}
          </button>
          {(mode === "edit" || mode === "add") && (
            <button onClick={handleSave} className="rounded-2xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
              {mode === "add" ? "Save credential" : "Save changes"}
            </button>
          )}
          {mode === "delete" && (
            <button onClick={() => onDelete?.(credential?.id)} className="rounded-2xl bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-700">
              Delete credential
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
