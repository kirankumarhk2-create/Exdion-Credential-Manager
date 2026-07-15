export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-slate-900 text-white px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">🤖 EXDION CASH</h1>

        <button onClick={() => window.location.href="/"} className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg transition">
          Logout
        </button>
      </header>

      {/* Main Content */}
      <div className="p-6 grid lg:grid-cols-4 gap-6">
        {/* User Profile */}
        <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
          <h2 className="text-xl font-bold mb-5">User Details</h2>

          <div className="space-y-3 text-gray-700">
            <p>
              <span className="font-semibold">Name:</span> Kiran Kumar HK
            </p>

            <p>
              <span className="font-semibold">ID:</span> EX001
            </p>

            <p>
              <span className="font-semibold">Department:</span> IT
            </p>

            <p>
              <span className="font-semibold">Email:</span>{" "}
              kirankumar_hk@exdion.com
            </p>

            <div>
              <span className="font-semibold">Role:</span>{" "}
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                Administrator
              </span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="lg:col-span-3 space-y-6">
          {/* AI Assistant */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-2">
              🤖 Robo Assistant
            </h2>

            <p className="text-gray-500 mb-5">
              Click the robot to start chatting!
            </p>

            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white text-4xl cursor-pointer hover:scale-110 transition">
                🤖
              </div>

              <input
                type="text"
                placeholder="Ask anything..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button className="w-12 h-12 rounded-full bg-green-500 text-white text-xl">
                🎤
              </button>

              <button className="w-12 h-12 rounded-full bg-blue-600 text-white text-xl">
                🔍
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition">
              + Add Credential
            </button>

            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition">
              Clear All
            </button>
          </div>

          {/* Credential Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="p-4">S.No</th>
                  <th>Credential</th>
                  <th>Password</th>
                  <th>Email</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                <tr className="hover:bg-gray-50">
                  <td className="p-4">1</td>
                  <td>SAP</td>
                  <td>******</td>
                  <td>sap@company.com</td>

                  <td>
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                      High
                    </span>
                  </td>

                  <td>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      Active
                    </span>
                  </td>

                  <td className="space-x-2">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded">
                      View
                    </button>

                    <button className="bg-orange-500 text-white px-3 py-1 rounded">
                      Edit
                    </button>

                    <button className="bg-red-500 text-white px-3 py-1 rounded">
                      Delete
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-gray-50">
                  <td className="p-4">2</td>
                  <td>Oracle</td>
                  <td>******</td>
                  <td>oracle@company.com</td>

                  <td>
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                      Medium
                    </span>
                  </td>

                  <td>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      Active
                    </span>
                  </td>

                  <td className="space-x-2">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded">
                      View
                    </button>

                    <button className="bg-orange-500 text-white px-3 py-1 rounded">
                      Edit
                    </button>

                    <button className="bg-red-500 text-white px-3 py-1 rounded">
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Email Access */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">
              Assigned Email Access
            </h2>

            <div className="flex flex-wrap gap-4">
              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full">
                ✔ SAP Mail
              </span>

              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full">
                ✔ Oracle Mail
              </span>

              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full">
                ✔ VPN Mail
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}