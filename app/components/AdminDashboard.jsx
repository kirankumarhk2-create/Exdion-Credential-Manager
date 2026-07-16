'use client';
import { useEffect, useMemo, useState } from 'react';
import CredentialModal from './CredentialModal';
import UserManagementModal from './UserManagementModal';

const initialCredentials = [];

const normalizeCredentials = (items = []) =>
  items.map((item, index) => {
    const isMaskedPassword = typeof item?.password === 'string' && /^\*+$/.test(item.password.trim());
    const fallbackPassword =
      item?.name === 'SAP'
        ? 'Sap@2026!'
        : item?.name === 'Oracle'
          ? 'Ora!2026#'
          : item?.name === 'VPN'
            ? 'Vpn#2026$'
            : `sample-password-${index + 1}`;

    return {
      ...item,
      password: isMaskedPassword ? fallbackPassword : item?.password ?? '',
    };
  });

const seededUsers = [
  { id: 1, username: 'admin', password: 'admin123', name: 'Kiran Kumar HK', email: 'kiran@exdion.com', role: 'admin', status: 'approved' },
  { id: 2, username: 'user', password: 'user123', name: 'Asha R', email: 'asha@exdion.com', role: 'user', status: 'approved' },
];

const persistVaultData = async (nextUsers, nextCredentials, nextTheme) => {
  try {
    const response = await fetch('/api/vault', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        users: nextUsers,
        credentials: nextCredentials,
        theme: nextTheme,
      }),
    });

    if (!response.ok) {
      return;
    }
  } catch {
    // ignore sync errors
  }
};

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [popNotification, setPopNotification] = useState('');
  const [credentials, setCredentials] = useState(() => normalizeCredentials(initialCredentials));
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [users, setUsers] = useState(seededUsers);
  const [theme, setTheme] = useState('ocean');
  const [currentUser, setCurrentUser] = useState(null);

  const triggerPop = (action, credential) => {
    setPopNotification(`${action} action triggered for ${credential}.`);
    setTimeout(() => {
      setPopNotification('');
    }, 2500);
  };

  const openModal = (mode, credential) => {
    setModalMode(mode);
    setSelectedCredential(credential);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalMode('view');
    setSelectedCredential(null);
  };

  const handleSave = (updatedCredential) => {
    const normalizedCredential = {
      ...updatedCredential,
      id: updatedCredential.id || Date.now(),
    };

    setCredentials((prev) => {
      const exists = prev.some((item) => item.id === normalizedCredential.id);
      const nextCredentials = exists
        ? prev.map((item) => (item.id === normalizedCredential.id ? normalizedCredential : item))
        : [normalizedCredential, ...prev];

      void persistVaultData(users, nextCredentials, theme);
      return nextCredentials;
    });

    triggerPop(updatedCredential.id ? 'Updated' : 'Added', normalizedCredential.name);
    closeModal();
  };

  const handleDelete = (id) => {
    setCredentials((prev) => {
      const nextCredentials = prev.filter((item) => item.id !== id);
      void persistVaultData(users, nextCredentials, theme);
      return nextCredentials;
    });
    triggerPop('Deleted', selectedCredential?.name || 'credential');
    closeModal();
  };

  const filteredCredentials = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return credentials;

    return credentials.filter((item) =>
      [item.name, item.email, item.description].some((value) => value.toLowerCase().includes(query))
    );
  }, [credentials, search]);

  const copyToClipboard = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      triggerPop('Password copied', 'clipboard');
    } catch {
      triggerPop('Copy failed', 'clipboard');
    }
  };

  const handleCreateUser = (user) => {
    const nextUsers = [{ ...user, status: user.status || 'approved' }, ...users];
    setUsers(nextUsers);
    void persistVaultData(nextUsers, credentials, theme);
    triggerPop('Created user', user.username);
  };

  const handleApproveUser = (userId) => {
    const nextUsers = users.map((user) => (user.id === userId ? { ...user, status: 'approved' } : user));
    setUsers(nextUsers);
    void persistVaultData(nextUsers, credentials, theme);
    triggerPop('Approved', 'user');
  };

  const handleRejectUser = (userId) => {
    const nextUsers = users.filter((user) => user.id !== userId);
    setUsers(nextUsers);
    void persistVaultData(nextUsers, credentials, theme);
    triggerPop('Rejected', 'user');
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/vault');
        if (response.ok) {
          const data = await response.json();
          setCredentials(normalizeCredentials(data.credentials || initialCredentials));
          setUsers(data.users || seededUsers);
          setTheme(data.theme || 'ocean');
        }
      } catch {
        // fall back
      }

      if (typeof window !== 'undefined') {
        const storedTheme = window.localStorage.getItem('theme') || 'ocean';
        setTheme(storedTheme);

        const storedUser = window.localStorage.getItem('currentUser');
        if (storedUser) {
          try {
            setCurrentUser(JSON.parse(storedUser));
          } catch {
            setCurrentUser(null);
          }
        }
      }
    };

    void loadData();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
      window.dispatchEvent(new Event('theme:changed'));
    }
  }, [theme]);

  const themeStyles = {
    ocean: 'from-blue-600 to-cyan-500',
    midnight: 'from-slate-800 to-indigo-700',
    emerald: 'from-emerald-600 to-teal-500',
  };

  return (
    <div className={`relative space-y-6 bg-gradient-to-br ${themeStyles[theme]} p-1 rounded-[2rem]`}>
      {popNotification && (
        <div className="fixed right-4 top-4 z-[9999] flex items-center gap-3 rounded-2xl border border-emerald-300 bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.45)] ring-1 ring-white/20">
          <span className="h-2.5 w-2.5 animate-ping rounded-full bg-white" />
          {popNotification}
        </div>
      )}

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-[0_20px_70px_-25px_rgba(15,23,42,0.45)]">
          <div className="mb-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
            Admin Overview
          </div>
          <h2 className="text-2xl font-semibold text-slate-900">Welcome back, {currentUser?.name || 'Kiran'}</h2>
          <p className="mt-2 text-sm text-slate-600">
            Manage stored credentials and team access from one secure dashboard.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { label: 'Active credentials', value: '24' },
              { label: 'Pending review', value: '6' },
              { label: 'Critical access', value: '3' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
                <p className="mt-1 text-xl font-semibold text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-lg shadow-slate-200/70">
          <div className="flex items-center gap-4">
            <div
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-3xl text-white shadow-lg transition ${isChatOpen ? 'ring-4 ring-cyan-200' : ''}`}
            >
              🤖
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Robo Assistant</h3>
              <p className="text-sm text-slate-500">{isChatOpen ? 'Ask a question or trigger an action.' : 'Click the robot to open the assistant.'}</p>
            </div>
          </div>

          {isChatOpen && (
            <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row">
              <input
                type="text"
                placeholder="Ask anything..."
                className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
              />
              <div className="flex gap-2">
                <button onClick={() => triggerPop('Voice input', 'Robo Assistant')} className="rounded-2xl bg-emerald-500 px-4 py-3 text-white">🎤</button>
                <button onClick={() => triggerPop('Search query', 'Robo Assistant')} className="rounded-2xl bg-blue-600 px-4 py-3 text-white">🔍</button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-6">
        <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-lg shadow-slate-200/70">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Credential access</h3>
              <p className="text-sm text-slate-500">Review and manage team credentials quickly.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search credentials"
                className="rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
              <button onClick={() => setUserModalOpen(true)} className="rounded-2xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white">+ Add user</button>
              <button onClick={() => openModal('add', null)} className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">+ Add</button>
              <button onClick={() => triggerPop('Clear data', 'All credentials')} className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white">Clear</button>
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
                        <button onClick={() => { triggerPop('View', item.name); openModal('view', item); }} className="rounded-lg bg-blue-50 px-2.5 py-2 text-blue-600">👁️</button>
                        <button onClick={() => { triggerPop('Edit', item.name); openModal('edit', item); }} className="rounded-lg bg-amber-50 px-2.5 py-2 text-amber-600">✏️</button>
                        <button onClick={() => { triggerPop('Delete', item.name); openModal('delete', item); }} className="rounded-lg bg-rose-50 px-2.5 py-2 text-rose-600">🗑️</button>
                        <button onClick={() => copyToClipboard(item.email)} className="rounded-lg bg-emerald-50 px-2.5 py-2 text-emerald-600" title="Copy username">👤</button>
                        <button onClick={() => copyToClipboard(item.password)} className="rounded-lg bg-violet-50 px-2.5 py-2 text-violet-600" title="Copy password">🔑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-[0_20px_70px_-25px_rgba(15,23,42,0.45)]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">User management</h3>
            <p className="text-sm text-slate-500">Approve access requests and manage who can use the application.</p>
          </div>
          <button onClick={() => setUserModalOpen(true)} className="rounded-2xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white">Create user</button>
        </div>

        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Pending approvals: {users.filter((user) => user.status === 'pending').length}
        </div>

        <div className="grid gap-3">
          {users.map((user) => (
            <div key={user.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <p className="font-semibold text-slate-900">{user.name}</p>
                <p className="text-sm text-slate-500">{user.username} • {user.email}</p>
                <p className={`mt-1 text-xs font-semibold uppercase tracking-wide ${user.status === 'pending' ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {user.status === 'pending' ? 'Pending approval' : 'Approved'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => copyToClipboard(user.username)} className="rounded-2xl bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">Copy username</button>
                {user.status === 'pending' && (
                  <>
                    <button onClick={() => handleApproveUser(user.id)} className="rounded-2xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">Approve</button>
                    <button onClick={() => handleRejectUser(user.id)} className="rounded-2xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white">Reject</button>
                  </>
                )}
              </div>
            </div>
          ))}
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
      <UserManagementModal
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        onCreate={handleCreateUser}
      />
    </div>
  );
}