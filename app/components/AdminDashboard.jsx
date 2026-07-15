'use client'
import { useState } from 'react';

export default function App() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [popNotification, setPopNotification] = useState("");

  // Handler for actions triggering the pop notification
  const triggerPop = (action, credential) => {
    setPopNotification(`${action} action triggered for ${credential}!`);
    setTimeout(() => {
      setPopNotification("");
    }, 2500);
  };

  // Login processing
  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin23') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password.');
    }
  };

  // Logout processing
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  // 1. RENDER LOGIN SCREEN IF NOT AUTHENTICATED
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 font-sans px-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
          
          <div className="text-center mb-8">
            <span className="text-4xl">🤖</span>
            <h1 className="text-2xl font-bold text-slate-800 mt-2 tracking-wide">EXDION CASH</h1>
            <p className="text-sm text-gray-500 mt-1">Please log in to manage admin panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center font-medium animate-pulse">
                ❌ {loginError}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Username</label>
              <input 
                type="text" 
                value={username}
                placeholder="Enter admin username" 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 font-medium"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                placeholder="Enter admin password" 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 font-medium"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg active:scale-[0.99]"
            >
              Secure Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. RENDER MAIN ADMIN DASHBOARD SCREEN ON SUCCESSFUL AUTHENTICATION
  return (
    <div className="min-h-screen bg-slate-100 font-sans relative">
      
      {/* Dynamic Green Light Pop-up Notification */}
      {popNotification && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl animate-bounce border-2 border-green-300">
          <span className="w-3 h-3 bg-white rounded-full animate-ping"></span>
          <span className="font-semibold">{popNotification}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-slate-900 text-white px-8 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold tracking-wide flex items-center gap-2">
          <span>🤖</span> EXDION CASH
        </h1>

        <button 
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-sm font-medium px-5 py-2 rounded-lg transition-all shadow-md active:scale-95"
        >
          Logout
        </button>
      </header>

      {/* Main Content Layout */}
      <div className="p-6 grid lg:grid-cols-4 gap-6">
        
        {/* User Profile */}
        <div className="bg-white rounded-2xl shadow-lg p-6 h-fit border border-gray-100">
          <h2 className="text-xl font-bold mb-5 text-slate-800 pb-2 border-b">User Details</h2>

          <div className="space-y-4 text-gray-700">
            <p className="flex justify-between items-center">
              <span className="font-semibold text-gray-500">Name:</span> 
              <span className="font-medium text-slate-900">Kiran Kumar HK</span>
            </p>

            <p className="flex justify-between items-center">
              <span className="font-semibold text-gray-500">ID:</span> 
              <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-900">EX001</span>
            </p>

            <p className="flex justify-between items-center">
              <span className="font-semibold text-gray-500">Department:</span> 
              <span className="font-medium text-slate-900">IT</span>
            </p>

            <div className="flex flex-col gap-1">
              <span className="font-semibold text-gray-500">Email:</span>
              <span className="text-sm font-medium text-blue-600 break-all">kirankumar_hk@exdion.com</span>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <span className="font-semibold text-gray-500">Role:</span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm">
                Administrator
              </span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* AI Assistant (Hidden inside Robot Picture until clicked) */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transition-all duration-300">
            <div className="flex items-center gap-5">
              
              {/* Clickable Robot Avatar */}
              <div 
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white text-4xl cursor-pointer select-none transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-md ${
                  isChatOpen ? 'ring-4 ring-cyan-300' : 'animate-pulse'
                }`}
                title="Click me to open/hide chat!"
              >
                🤖
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-800">Robo Assistant</h2>
                <p className="text-sm text-gray-500">
                  {isChatOpen ? "Click the robot again to hide assistant window." : "Click the robot avatar to start chatting!"}
                </p>
              </div>
            </div>

            {/* Collapsible Chat Elements */}
            {isChatOpen && (
              <div className="mt-6 pt-5 border-t border-gray-100 flex items-center gap-4 animate-fadeIn">
                <input
                  type="text"
                  placeholder="Ask anything..."
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />

                <button 
                  onClick={() => triggerPop("Voice Input", "Robo Chat")}
                  className="w-12 h-12 rounded-xl bg-green-500 hover:bg-green-600 text-white text-xl flex items-center justify-center shadow-md transition-all active:scale-90"
                >
                  🎤
                </button>

                <button 
                  onClick={() => triggerPop("Search Query", "Robo Chat")}
                  className="w-12 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xl flex items-center justify-center shadow-md transition-all active:scale-90"
                >
                  🔍
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-4">
            <button 
              onClick={() => triggerPop("Add", "New Credential")}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium tracking-wide shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <span>+</span> Add Credential
            </button>

            <button 
              onClick={() => triggerPop("Clear Data", "All Credentials")}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium tracking-wide shadow-md transition-all active:scale-95"
            >
              Clear All
            </button>
          </div>

          {/* Credential Table with Symbols */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-900 text-white text-sm font-semibold tracking-wider">
                  <tr>
                    <th className="p-4 text-center">S.No</th>
                    <th className="p-4">Credential</th>
                    <th className="p-4">Password</th>
                    <th className="p-4">Email</th>
                    <th className="p-4 text-center">Priority</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  
                  {/* Row 1 - SAP */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-center text-gray-400">1</td>
                    <td className="p-4 font-bold text-slate-800">SAP</td>
                    <td className="p-4 tracking-widest font-mono text-gray-400">******</td>
                    <td className="p-4 font-medium text-gray-600">sap@company.com</td>
                    <td className="p-4 text-center">
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                        High
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                        Active
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center items-center gap-3">
                        {/* View Symbol */}
                        <button 
                          onClick={() => triggerPop("View", "SAP")}
                          className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all active:scale-90"
                          title="View"
                        >
                          👁️
                        </button>
                        {/* Edit Symbol */}
                        <button 
                          onClick={() => triggerPop("Edit", "SAP")}
                          className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-lg transition-all active:scale-90"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        {/* Delete Symbol */}
                        <button 
                          onClick={() => triggerPop("Delete", "SAP")}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all active:scale-90"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 2 - Oracle */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-center text-gray-400">2</td>
                    <td className="p-4 font-bold text-slate-800">Oracle</td>
                    <td className="p-4 tracking-widest font-mono text-gray-400">******</td>
                    <td className="p-4 font-medium text-gray-600">oracle@company.com</td>
                    <td className="p-4 text-center">
                      <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
                        Medium
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                        Active
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center items-center gap-3">
                        {/* View Symbol */}
                        <button 
                          onClick={() => triggerPop("View", "Oracle")}
                          className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all active:scale-90"
                          title="View"
                        >
                          👁️
                        </button>
                        {/* Edit Symbol */}
                        <button 
                          onClick={() => triggerPop("Edit", "Oracle")}
                          className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-lg transition-all active:scale-90"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        {/* Delete Symbol */}
                        <button 
                          onClick={() => triggerPop("Delete", "Oracle")}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all active:scale-90"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>

          {/* Email Access Indicators */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-slate-800">
              Assigned Email Access
            </h2>

            <div className="flex flex-wrap gap-3">
              <span className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-xl text-sm font-medium shadow-sm">
                ✔ SAP Mail
              </span>

              <span className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-xl text-sm font-medium shadow-sm">
                ✔ Oracle Mail
              </span>

              <span className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-xl text-sm font-medium shadow-sm">
                ✔ VPN Mail
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}