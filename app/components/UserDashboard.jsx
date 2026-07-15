"use client";

import { useEffect, useMemo, useState } from "react";
import CredentialModal from "./CredentialModal";

const initialCredentials = [
  { id: 1, name: "SAP", email: "sap.user", password: "Sap@2026!", description: "Primary ERP access" },
  { id: 2, name: "Oracle", email: "finance.user", password: "Ora!2026#", description: "Finance system access" },
  { id: 3, name: "VPN", email: "remote.user", password: "Vpn#2026$", description: "Secure remote onboarding" },
];

const normalizeCredentials = (items = []) =>
  items.map((item, index) => {
    const isMaskedPassword = typeof item?.password === "string" && /^\*+$/.test(item.password.trim());
    const fallbackPassword =
      item?.name === "SAP"
        ? "Sap@2026!"
        : item?.name === "Oracle"
          ? "Ora!2026#"
          : item?.name === "VPN"
            ? "Vpn#2026$"
            : `sample-password-${index + 1}`;

    return {
      ...item,
      password: isMaskedPassword ? fallbackPassword : item?.password ?? "",
    };
  });

export default function UserDashboard() {
  const [selectedAction, setSelectedAction] = useState("");
  const [credentials, setCredentials] = useState(() => normalizeCredentials(initialCredentials));
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState("ocean");
  const [currentUser, setCurrentUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [selectedCredential, setSelectedCredential] = useState(null);

  const openModal = (mode, credential) => {
    setModalMode(mode);
    setSelectedCredential(credential);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalMode("view");
    setSelectedCredential(null);
  };

  const handleSave = (updatedCredential) => {
    const normalizedCredential = {
      ...updatedCredential,
      id: updatedCredential.id || Date.now(),
    };

    setCredentials((prev) => {
      const exists = prev.some((item) => item.id === normalizedCredential.id);
      if (exists) {
        return prev.map((item) => (item.id === normalizedCredential.id ? normalizedCredential : item));
      }
      return [normalizedCredential, ...prev];
    });

    closeModal();
  };

  const handleDelete = (id) => {
    setCredentials((prev) => prev.filter((item) => item.id !== id));
    closeModal();
  };

  const filteredCredentials = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return credentials;

    return credentials.filter((item) => [item.name, item.email, item.description].some((value) => value.toLowerCase().includes(query)));
  }, [credentials, search]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedCredentials = window.localStorage.getItem("vaultCredentials");
        if (storedCredentials) {
          const parsedCredentials = JSON.parse(storedCredentials);
          setCredentials(normalizeCredentials(parsedCredentials));
        }
      } catch {
        // fall back
      }

      const storedTheme = window.localStorage.getItem("theme") || "ocean";
      setTheme(storedTheme);
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("vaultCredentials", JSON.stringify(credentials));
    }
  }, [credentials]);

  const copyToClipboard = async (value) => {
    try {
      await navigator.clipboard.writeText(String(value ?? ""));
    } catch {
      // ignore clipboard errors
    }
  };

  const themeStyles = {
    ocean: "from-blue-600 to-cyan-500",
    midnight: "from-slate-800 to-indigo-700",
    emerald: "from-emerald-600 to-teal-500",
  };

  return (
    <div className={`space-y-6 rounded-[2rem] border border-slate-200/70 bg-white/90 p-4 shadow-[0_20px_70px_-25px_rgba(15,23,42,0.35)] md:p-6 lg:p-8`}>
      <section className="grid gap-6">
        <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-lg shadow-slate-200/70">
          <h3 className="text-xl font-semibold text-slate-900">Quick actions</h3>
          <div className="mt-5 flex flex-wrap gap-3">
            {['View access', 'Request update', 'Report issue'].map((action) => (
              <button
                key={action}
                onClick={() => setSelectedAction(action)}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${selectedAction === action ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                {action}
              </button>
            ))}
          </div>
          {selectedAction && <p className="mt-4 text-sm text-slate-600">Selected action: <span className="font-semibold text-slate-900">{selectedAction}</span></p>}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-lg shadow-slate-200/70">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Your credentials</h3>
            <p className="text-sm text-slate-500">Use the view and edit actions to keep your access current.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search credentials"
              className="rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
            <button onClick={() => openModal("add", null)} className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">+ Add</button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-900 text-left text-white">
              <tr>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Notes</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredCredentials.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-900">{item.name}</td>
                  <td className="px-4 py-3 text-slate-600">{item.email}</td>
                  <td className="px-4 py-3 text-slate-600">{item.description}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openModal('view', item)} className="rounded-lg bg-blue-50 px-2.5 py-2 text-blue-600">👁️</button>
                      <button onClick={() => openModal('edit', item)} className="rounded-lg bg-amber-50 px-2.5 py-2 text-amber-600">✏️</button>
                      <button onClick={() => openModal('delete', item)} className="rounded-lg bg-rose-50 px-2.5 py-2 text-rose-600">🗑️</button>
                      <button onClick={() => copyToClipboard(item.email)} className="rounded-lg bg-emerald-50 px-2.5 py-2 text-emerald-600" title="Copy username">👤</button>
                      <button onClick={() => copyToClipboard(item.password)} className="rounded-lg bg-violet-50 px-2.5 py-2 text-violet-600" title="Copy password">🔑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <CredentialModal
        isOpen={modalOpen}
        mode={modalMode}
        credential={selectedCredential}
        onClose={closeModal}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}