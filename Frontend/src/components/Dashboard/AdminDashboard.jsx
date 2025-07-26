import React, { useState, useEffect, useMemo } from 'react';
import {
  FaUsers,
  FaTachometerAlt,
  FaSignOutAlt,
  FaBars,
  FaShieldAlt,
} from 'react-icons/fa';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import UserFullProfileModal from './UserFullProfileModal';
import AuthService from '../../services/authService';
import { toast } from 'sonner';

const AdminDashboard = ({ user: adminUser }) => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userError, setUserError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setUserError(null);
    try {
      const data = await AuthService.getAllUsers();
      const validUsers = Array.isArray(data) ? data.filter(user => user && typeof user === 'object') : [];
      setUsers(validUsers);
    } catch (err) {
      setUserError(err.message || 'Failed to fetch users');
      toast.error('Failed to fetch users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const userId = user.id || user._id;
      const matchesSearch =
        (user.user_id?.toString() || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (userId?.toString() || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filter === 'All' ||
        (filter === 'Premium' && (user.is_premium || user.isPremium)) ||
        (filter === 'Non-Premium' && !user.is_premium && !user.isPremium);

      return matchesSearch && matchesFilter;
    });
  }, [users, searchTerm, filter]);

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const premiumUsers = users.filter(u => u.is_premium || u.isPremium).length;
    const nonPremiumUsers = totalUsers - premiumUsers;
    return { totalUsers, premiumUsers, nonPremiumUsers };
  }, [users]);

  const handleLogout = () => {
    AuthService.logout();
    toast.success('Successfully logged out!');
    navigate('/'); // Redirect to landing page
  };

  const handleOpenUserProfile = user => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleUserUpdate = updatedUser => {
    const updatedUserId = updatedUser.id || updatedUser._id;
    setUsers(prev =>
      prev.map(u => {
        const userId = u.id || u._id;
        return userId === updatedUserId ? { ...u, ...updatedUser } : u;
      })
    );
    toast.success('User updated successfully!');
  };

  const handleCloseUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  const baseBg = isDarkMode ? 'bg-[#0a1627]' : 'bg-slate-100';
  const baseText = isDarkMode ? 'text-white' : 'text-slate-900';
  const cardBg = isDarkMode ? 'bg-[#0e1a2f] border-[#22304a]' : 'bg-white border-slate-300';
  const panelBg = isDarkMode ? 'bg-[#101c34] border-[#22304a]' : 'bg-white border-slate-300';

  return (
    <div className={`flex flex-col lg:flex-row min-h-screen ${baseBg} ${baseText}`}>
      <aside className={`fixed z-40 top-0 left-0 h-full w-64 ${panelBg} p-6 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center gap-3 mb-10">
          <FaShieldAlt className="text-blue-400 text-2xl" />
          <span className="text-2xl font-bold tracking-wide">Admin Panel</span>
        </div>
        <nav className="flex flex-col gap-3">
          <button onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : isDarkMode ? 'text-slate-300 hover:bg-[#172447]' : 'text-slate-700 hover:bg-slate-200'}`}>
            <FaTachometerAlt /> Dashboard
          </button>
          <button onClick={() => { setActiveTab('users'); setSidebarOpen(false); }} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium ${activeTab === 'users' ? 'bg-blue-600 text-white' : isDarkMode ? 'text-slate-300 hover:bg-[#172447]' : 'text-slate-700 hover:bg-slate-200'}`}>
            <FaUsers /> Users
          </button>
        </nav>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <header className={`w-full h-16 ${baseBg} border-b ${isDarkMode ? 'border-[#22304a]' : 'border-slate-300'} flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20`}>
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-white text-xl" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <FaBars />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1 rounded transition-all flex items-center justify-center border border-transparent hover:border hover:border-slate-400 hover:bg-transparent focus:outline-none"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              style={{ fontSize: '1rem', background: 'transparent' }}
            >
              {isDarkMode
                ? <FiSun className="text-yellow-300" />
                : <FiMoon className="text-black" />}
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white text-sm font-semibold">
              Logout <FaSignOutAlt className="hidden sm:inline" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <section>
              <h1 className="text-2xl sm:text-3xl font-bold mb-8">Admin Dashboard</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className={`rounded-xl border ${cardBg} p-6 md:p-8 text-center`}>
                  <div className="text-xl font-bold mb-2">Total Users</div>
                  <div className="text-4xl font-extrabold">{stats.totalUsers}</div>
                </div>
                <div className={`rounded-xl border ${cardBg} p-6 md:p-8 text-center`}>
                  <div className="text-xl font-bold mb-2">Premium Users</div>
                  <div className="text-4xl font-extrabold text-green-400">{stats.premiumUsers}</div>
                </div>
                <div className={`rounded-xl border ${cardBg} p-6 md:p-8 text-center`}>
                  <div className="text-xl font-bold mb-2">Non-Premium Users</div>
                  <div className="text-4xl font-extrabold text-slate-400">{stats.nonPremiumUsers}</div>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'users' && (
            <section>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                <h1 className="text-2xl font-bold">User List</h1>
                <div className="flex gap-2">
                  <button onClick={fetchUsers} className={`px-3 py-2 text-sm border rounded ${panelBg}`}>Refresh</button>
                  <button onClick={() => setActiveTab('dashboard')} className={`px-3 py-2 text-sm border rounded ${panelBg}`}>Back to Dashboard</button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Search by ID, Name, Email"
                  className={`flex-1 px-4 py-2 text-sm rounded ${panelBg} placeholder:text-slate-400 ${baseText}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  className={`px-4 py-2 text-sm rounded ${panelBg} ${baseText}`}
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="All">All Users</option>
                  <option value="Premium">Premium</option>
                  <option value="Non-Premium">Non-Premium</option>
                </select>
              </div>
              {loadingUsers ? (
                <p className="text-center text-slate-300">Loading users...</p>
              ) : userError ? (
                <p className="text-center text-red-400">{userError}</p>
              ) : (
                <div className={`overflow-x-auto rounded-xl border ${panelBg}`}>
                  <table className="w-full text-sm divide-y divide-[#22304a]">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left uppercase">User ID</th>
                        <th className="px-4 py-2 text-left uppercase">Name</th>
                        <th className="px-4 py-2 text-left uppercase">Email</th>
                        <th className="px-4 py-2 text-left uppercase">Account Type</th>
                        <th className="px-4 py-2 text-left uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(user => (
                        <tr key={user.id || user._id} className={isDarkMode ? 'hover:bg-[#22304a]' : 'hover:bg-slate-100'}>
                          <td className="px-4 py-3 font-mono text-blue-400">
                            #{user.user_id || user.id?.toString().slice(-6)}
                          </td>
                          <td className="px-4 py-3">{user.name || '-'}</td>
                          <td className="px-4 py-3 break-all">{user.email || '-'}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${user.is_premium ? 'bg-blue-900 text-blue-200' : 'bg-slate-800 text-slate-400'}`}>
                              {user.is_premium ? 'Premium' : 'Non-Premium'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => handleOpenUserProfile(user)} className="px-3 py-1 rounded bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold">
                              Open Full Profile
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}
        </main>
      </div>

      {showUserModal && selectedUser && (
        <UserFullProfileModal
          user={selectedUser}
          onClose={handleCloseUserModal}
          onUserUpdate={handleUserUpdate}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
