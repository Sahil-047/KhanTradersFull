import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../../services/authService';
import paymentService from '../../services/paymentService';
import { toast } from "sonner";
import { FaUser, FaCreditCard, FaThLarge, FaSignOutAlt, FaHome, FaEdit, FaTrash } from 'react-icons/fa';
import { FiSun, FiMoon } from 'react-icons/fi';
import Pricing from '../landing/Pricing'; // Adjust the path if needed
import ChangePassword from '../Auth/ResetPassword';

// Sidebar subcomponent
function Sidebar({ active, setActive, user, isDarkMode, sidebarOpen, setSidebarOpen }) {
  return (
    <aside className={`fixed z-30 top-0 left-0 h-full w-60 sm:w-60 md:w-60 lg:w-60 xl:w-60 ${isDarkMode ? 'bg-[#101c34] border-[#22304a] text-white' : 'bg-white border-slate-300 text-black'} border-r flex flex-col justify-between py-6 px-4 transition-transform duration-300 ease-in-out transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:relative sm:translate-x-0`}>
      <div>
        <div className="mb-8">
          <div className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>Navigation</div>
          <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Welcome, {user?.name || 'User'}</div>
        </div>
        <nav className="flex flex-col gap-2">
          <button onClick={() => { setActive('dashboard'); setSidebarOpen(false); }} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${active==='dashboard' ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700') : (isDarkMode ? 'text-slate-300 hover:bg-[#172447]' : 'text-black hover:bg-slate-200')}`}><FaThLarge /> Dashboard</button>
          <button onClick={() => { setActive('profile'); setSidebarOpen(false); }} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${active==='profile' ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700') : (isDarkMode ? 'text-slate-300 hover:bg-[#172447]' : 'text-black hover:bg-slate-200')}`}><FaUser /> Profile</button>
          <button onClick={() => { setActive('payment'); setSidebarOpen(false); }} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${active==='payment' ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700') : (isDarkMode ? 'text-slate-300 hover:bg-[#172447]' : 'text-black hover:bg-slate-200')}`}><FaCreditCard /> Payment Info</button>
          {/* WhatsApp Group Button - Only for Premium Members */}
          {(user?.is_premium || user?.isPremium) && (
            <a
              href="https://chat.whatsapp.com/FatUrVFnICC5ZTnXl1rueq?mode=ac_t"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 px-3 py-2 mt-2 rounded-lg text-sm font-semibold justify-center transition-colors
                ${isDarkMode
                  ? 'bg-[#25D366] hover:bg-[#1ebe5d] text-[#101c34]'
                  : 'bg-[#25D366] hover:bg-[#1ebe5d] text-white'}
              `}
              style={{ boxShadow: isDarkMode ? '0 2px 8px #101c34' : '0 2px 8px #25D366' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.646.86 5.09 2.33 7.09L4.06 29.25a1 1 0 0 0 1.25 1.25l7.16-2.27A12.94 12.94 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.77 0-3.47-.36-5.01-1.01l-.36-.15-4.25 1.35 1.36-4.18-.18-.37A9.97 9.97 0 0 1 6 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.29-7.71c-.29-.15-1.71-.84-1.97-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.91 1.13-.17.19-.34.22-.63.07-.29-.15-1.23-.45-2.34-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49-.16-.01-.36-.01-.56-.01-.19 0-.51.07-.78.36-.27.29-1.03 1.01-1.03 2.46 0 1.45 1.06 2.85 1.21 3.05.15.19 2.09 3.19 5.07 4.35.71.31 1.26.5 1.69.64.71.23 1.36.2 1.87.12.57-.09 1.71-.7 1.95-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34z"/></svg>
              Join WhatsApp Group
            </a>
          )}
        </nav>
      </div>
      <div className={`w-full text-center text-sm pt-2 pb-3 border-t flex justify-start pl-1 ${isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'}`}>
        Developed by<Link to="https://asthetcss.in" target="_blank" className="underline hover:text-blue-400 pl-1">AsthetCSS</Link>
      </div>
    </aside>
  );
}

// Topbar subcomponent
function Topbar({ user, onLogout, isDarkMode, setIsDarkMode, setSidebarOpen }) {
  return (
    <header className={`w-full h-16 flex items-center justify-between px-2 sm:px-4 md:px-8 border-b ${isDarkMode ? 'bg-[#101c34] border-[#22304a]' : 'bg-white border-slate-300'}`}>
      <div className="flex items-center gap-3">
        <button className="sm:hidden text-xl" onClick={() => setSidebarOpen(val => !val)}>
          <FaThLarge />
        </button>
        <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>User Panel</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2 rounded-full border border-transparent hover:border-blue-400 focus:outline-none transition-colors ${isDarkMode ? 'bg-[#22304a] text-yellow-300' : 'bg-slate-200 text-blue-700'}`}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <FiSun /> : <FiMoon />}
        </button>
        <div className={`px-2 py-1 sm:px-4 sm:py-2 rounded-lg ${isDarkMode ? 'bg-[#172447] text-blue-200' : 'bg-slate-200 text-blue-700'} text-xs sm:text-sm font-semibold`}>
          User ID: #{user?.id || user?._id || 'N/A'}
        </div>
        <button onClick={onLogout} className={`flex items-center gap-2 px-2 py-1 sm:px-4 sm:py-2 rounded-lg ${isDarkMode ? 'bg-[#172447] text-slate-200 hover:bg-red-600' : 'bg-red-100 text-red-800 hover:bg-red-200'} text-xs sm:text-sm font-medium`}><FaSignOutAlt /> Logout</button>
      </div>
    </header>
  );
}

const UserDashboard = ({ isDarkMode: initialDarkMode = false, user: initialUser }) => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(initialDarkMode);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(initialUser ? { ...initialUser } : {});
  const [deleted, setDeleted] = useState(false);
  const [active, setActive] = useState('dashboard');
  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bankToDelete, setBankToDelete] = useState(null);
  const [completedPayments, setCompletedPayments] = useState([]);
  const [investmentPayments, setInvestmentPayments] = useState([]);
  const [currentUser, setCurrentUser] = useState(initialUser);
  // State for add/edit bank account modal
  const [showBankForm, setShowBankForm] = useState(false);
  const [editingBankIndex, setEditingBankIndex] = useState(null); // null for add, index for edit
  const [bankForm, setBankForm] = useState({
    account_holder_name: '',
    account_number: '',
    account_type: '',
    bank_id: '',
    bank_name: '',
    branch: '',
    ifsc: '',
  });
  const [editingBank, setEditingBank] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Determine if user is adding a new bank or editing existing
  const isNewBank = !form.bank_details;
  const existingBankId = !isNewBank && form.bank_details?._id;

  // Fetch current user data on component mount
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const userData = await AuthService.getProfile();
        setCurrentUser(userData);
        setForm(userData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        toast.error('Failed to load user data');
      }
    }
    fetchCurrentUser();
  }, []);

  if (!currentUser) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0d172a] text-white">Loading user...</div>;
  }

  // Check if user is premium - if not, show non-premium page
  if (!currentUser.is_premium && !currentUser.isPremium && !showPricing) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-[#0d172a] text-white' : 'bg-slate-100 text-slate-900'}`}>
        <div className={`${isDarkMode ? 'bg-[#101c34] border-[#22304a] text-white' : 'bg-white border-slate-300 text-slate-900'} border rounded-xl p-8 text-center max-w-md`}>
          <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>Membership Required</h2>
          <p className={`mb-6 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            You are not a premium member yet.<br />
            Please join our membership to access the member dashboard and exclusive features.
          </p>
          <button
            onClick={() => setShowPricing(true)}
            className={`inline-block px-6 py-3 rounded-lg font-semibold transition
            ${isDarkMode
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Join Membership
          </button>
        </div>
      </div>
    );
  }

  if (!currentUser.is_premium && !currentUser.isPremium && showPricing) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${isDarkMode ? 'bg-[#0d172a] text-white' : 'bg-slate-100 text-slate-900'}`}>
        <div className="w-full max-w-4xl">
          <Pricing isDarkMode={isDarkMode} />
        </div>
        {/* Back button to return to non-premium message */}
        <button
          onClick={() => setShowPricing(false)}
          className={`mt-6 px-4 py-2 rounded-lg font-semibold transition
          ${isDarkMode
            ? 'bg-slate-700 hover:bg-slate-600 text-white'
            : 'bg-slate-300 hover:bg-slate-400 text-slate-700'
          }`}
        >
          Back
        </button>
      </div>
    );
  }

  // Use name, or username, or fallback to 'U'
  const displayName = currentUser.name || currentUser.username || 'User';
  const avatarText = displayName.split(' ').map(n => n[0]).join('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const refreshUserProfile = async () => {
    try {
      const updatedUser = await AuthService.getProfile();
      setCurrentUser(updatedUser);
      setForm(updatedUser);
    } catch (err) {
      toast.error('Failed to refresh user profile');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const userId = currentUser.id || currentUser._id;
      if (!userId) {
        toast.error('User ID not found. Please refresh and try again.');
        return;
      }
      
      await AuthService.updateProfile(userId, {
        email: form.email,
        name: form.name,
        user_phone: form.user_phone,
        aadhar: form.aadhar,
        pan: form.pan,
        age: form.age,
        gender: form.gender,
        dob: form.dob,
        is_premium: form.is_premium,
        premium_expiry: form.premium_expiry,
        joined_whatsapp: form.joined_whatsapp,
        bank_id: form.bank_id,
        profile_id: form.profile_id,
        user_id: form.user_id,
        // Do not send created_at or bank_accounts unless you want to update them
      });
      toast.success('Profile updated!');
      setEdit(false);
      await refreshUserProfile();
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    }
  };

  const handleBankUpdate = async (e) => {
    e.preventDefault();
    try {
      // Check if user already has 2 bank accounts
      if (form.bank_accounts && form.bank_accounts.length >= 2 && !form.bank_details) {
        toast.error('You can only add up to 2 bank accounts.');
        return;
      }
      const bankFormData = {
        account_holder_name: form.accountHolder,
        account_number: form.accountNumber,
        account_type: form.accountType,
        bank_id: form.bankId,
        bank_name: form.bankName,
        branch: form.branch,
        ifsc: form.ifsc,
        // Add user identity information for backend validation
        phone: currentUser.user_phone || form.user_phone,
        aadhar: currentUser.aadhar || form.aadhar,
        pan: currentUser.pan || form.pan,
      };
      const hasBank = !!form.bank_details;
      const existingBankId = hasBank ? (form.bank_details.id || form.bank_details._id) : null;
      if (hasBank && existingBankId) {
        await AuthService.updateBank(existingBankId, bankFormData);
        toast.success('Bank details updated!');
      } else {
        const newBank = await AuthService.createBank(bankFormData);
        toast.success('Bank added successfully!');
      }
      await refreshUserProfile();
    } catch (err) {
      toast.error(err.message || 'Failed to update bank details');
    }
  };

  const handleDelete = () => {
    // TODO: Call backend to delete user, then update UI
    setDeleted(true);
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      AuthService.logout();
      toast.success("Successfully logged out!");
      navigate('/'); // Redirect to landing page
    } catch (error) {
      toast.error('Logout failed. Please try again.');
    }
  };

  const fetchUpcomingPayments = async () => {
    if (!currentUser) return;
    
    const userId = currentUser.id || currentUser._id;
    if (!userId) {
      console.warn('No user ID available for fetching upcoming payments');
      toast.error('User ID not found. Please refresh the page.');
      return;
    }
    
    setLoading(true);
    try {
      const data = await paymentService.getUpcomingPayments(userId);
      setUpcomingPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch upcoming payments:', err);
      toast.error('Failed to load upcoming payments. Please try again.');
      setUpcomingPayments([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUpcomingPayments();
  }, [currentUser?.id, currentUser?._id]);

  const fetchCompletedPayments = async () => {
    if (!currentUser) return;
    
    const userId = currentUser.id || currentUser._id;
    if (!userId) {
      console.warn('No user ID available for fetching completed payments');
      toast.error('User ID not found. Please refresh the page.');
      return;
    }
    
    setLoading(true);
    try {
      const data = await paymentService.getCompletedPayments(userId);
      setCompletedPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch completed payments:', err);
      toast.error('Failed to load payment history. Please try again.');
      setCompletedPayments([]);
    }
    setLoading(false);
  };

  const fetchInvestmentPayments = async () => {
    if (!currentUser) return;
    
    const userId = currentUser.id || currentUser._id;
    if (!userId) {
      console.warn('No user ID available for fetching completed payments');
      toast.error('User ID not found. Please refresh the page.');
      return;
    }
    
    setLoading(true);
    try {
      const data = await paymentService.getInvestmentPayments(userId);
      setInvestmentPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch completed payments:', err);
      toast.error('Failed to load payment history. Please try again.');
      setInvestmentPayments([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompletedPayments();
    fetchInvestmentPayments();
  }, [currentUser?.id, currentUser?._id]);

  // Find the most recent completed payment
  const lastPayment = completedPayments.length > 0
    ? completedPayments.reduce((latest, payment) =>
        new Date(payment.date) > new Date(latest.date) ? payment : latest
      )
    : null;

  useEffect(() => {
    console.log('form after refresh:', form);
  }, [form]);

  if (deleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d172a] text-white">
        <div className="p-8 rounded-xl shadow-lg bg-red-50 border border-red-200 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Account Deleted</h2>
          <p>Your account details have been deleted.</p>
        </div>
      </div>
    );
  }

  // Remove array handling and debug log for bank_details
  // Show current bank details summary if available
  console.log('form.bank_accounts:', form.bank_accounts);
  const hasBankDetails = form.bank_accounts &&
    (form.bank_accounts.length > 0 &&
     (form.bank_accounts[0].account_holder_name ||
      form.bank_accounts[0].account_number ||
      form.bank_accounts[0].bank_name ||
      form.bank_accounts[0].ifsc ||
      form.bank_accounts[0].branch));

  {hasBankDetails ? (
    <div className={`mt-8 bg-[#172447] border border-[#22304a] rounded-xl p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-slate-300 text-black'}`}>
      <h3 className="text-lg font-bold mb-4 text-blue-300">Your Current Bank Details</h3>
      <div className="grid grid-cols-1 gap-y-3 gap-x-8">
        {form.bank_accounts && form.bank_accounts.map((bank, idx) => (
          <div key={bank._id || bank.id || idx} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#22304a] py-2">
            <div className="flex-1">
              <div><span className="text-slate-400 font-semibold">Account Holder Name:</span><span className="ml-2 text-white">{bank.account_holder_name}</span></div>
              <div><span className="text-slate-400 font-semibold">Account Number:</span><span className="ml-2 text-white">{bank.account_number}</span></div>
              <div><span className="text-slate-400 font-semibold">Bank Name:</span><span className="ml-2 text-white">{bank.bank_name}</span></div>
              <div><span className="text-slate-400 font-semibold">IFSC:</span><span className="ml-2 text-white">{bank.ifsc_code || bank.ifsc}</span></div>
              <div><span className="text-slate-400 font-semibold">Branch:</span><span className="ml-2 text-white">{bank.branch}</span></div>
            </div>
            <div className="flex gap-2 mt-2 sm:mt-0">
              <button
                className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                onClick={() => handleOpenEditBank(idx)}
              >
                <FaEdit /> Edit
              </button>
              <button
                className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
                onClick={() => handleDeleteBank(bank.bank_id || bank._id)}
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className={`mt-8 bg-[#172447] border border-[#22304a] rounded-xl p-6 text-slate-400 text-center ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-slate-300 text-black'}`}>
      No bank account added yet.
    </div>
  )}

  const handleOpenAddBank = () => {
    setEditingBankIndex(null);
    setBankForm({
      account_holder_name: '',
      account_number: '',
      account_type: '',
      bank_id: '',
      bank_name: '',
      branch: '',
      ifsc: '',
    });
    setShowBankForm(true);
  };
  const handleOpenEditBank = (idx) => {
    const bank = form.bank_accounts[idx];
    setEditingBankIndex(idx);
    setBankForm({
      account_holder_name: bank.account_holder_name || '',
      account_number: bank.account_number || '',
      account_type: bank.account_type || '',
      bank_id: bank.bank_id || '',
      bank_name: bank.bank_name || '',
      branch: bank.branch || '',
      ifsc: bank.ifsc || '',
    });
    setShowBankForm(true);
  };
  const handleBankFormChange = (e) => {
    setBankForm({ ...bankForm, [e.target.name]: e.target.value });
  };
  const handleBankFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare bank data with user identity information for validation
      const bankDataWithIdentity = {
        ...bankForm,
        account_holder_name: currentUser.name || form.account_holder_name,
        phone: currentUser.user_phone || form.user_phone,
        aadhar: currentUser.aadhar || form.aadhar,
        pan: currentUser.pan || form.pan,
        user_id: currentUser.id || currentUser._id,
      };
      if (editingBankIndex === null) {
        // Add new bank account
        if (form.bank_accounts && form.bank_accounts.length >= 2) {
          toast.error('You can only add up to 2 bank accounts.');
          return;
        }
        await AuthService.createBank(bankDataWithIdentity);
        
        // Refresh the user profile to get the latest bank accounts
        await refreshUserProfile();
        
        toast.success('Bank account added!');
      } else {
        // Update existing bank account
        const bank = form.bank_accounts[editingBankIndex];
        const bankId = bank.id || bank._id;
        if (!bankId) {
          toast.error('Bank ID not found. Please refresh and try again.');
          return;
        }
        console.log('Adding new bank with data:', bankDataWithIdentity);
        await AuthService.updateBank(bankId, bankDataWithIdentity);
        await refreshUserProfile();
        toast.success('Bank account updated!');
      }
      setShowBankForm(false);
    } catch (err) {
      toast.error(err.message || 'Failed to save bank account');
    }
  };

  // Open delete modal for a specific bank
  const handleDeleteBank = (bankId) => {
    setBankToDelete(bankId);
    setShowDeleteModal(true);
  };
  const confirmDeleteBank = async () => {
    if (!bankToDelete) return;
    try {
      const bankId = bankToDelete;
      if (!bankId) {
        toast.error('Bank ID not found');
        return;
      }
      
      // Use the deleteBank function from AuthService
      await AuthService.deleteBank(bankId);
      toast.success('Bank account deleted!');
      await refreshUserProfile();
    } catch (err) {
      toast.error(err.message || 'Failed to delete bank account');
    }
    setShowDeleteModal(false);
    setBankToDelete(null);
  };

  const handleEditBank = () => {
    setBankForm({
      account_holder_name: form.bank_details.account_holder_name || '',
      account_number: form.bank_details.account_number || '',
      account_type: form.bank_details.account_type || '',
      bank_id: form.bank_details.bank_id || '',
      bank_name: form.bank_details.bank_name || '',
      branch: form.bank_details.branch || '',
      ifsc: form.bank_details.ifsc || '',
    });
    setEditingBank(true);
    setShowBankForm(true);
  };

  return (
    <div className={`flex flex-col sm:flex-row h-screen w-full ${isDarkMode ? 'bg-[#0d172a] text-white' : 'bg-slate-100 text-black'}`}>
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-20 sm:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}
      <Sidebar active={active} setActive={setActive} user={currentUser} isDarkMode={isDarkMode} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col h-screen w-full">
        <Topbar user={currentUser} onLogout={handleLogout} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-2 sm:p-4 md:p-8 w-full overflow-x-auto">
          {active === 'dashboard' && (
            <section>
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
                <div className="text-slate-400 text-base mb-6">Overview of your account and recent activity</div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Card 1: Account Type */}
                  <div className={`rounded-xl border border-[#22304a] p-6 flex flex-col gap-2 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-slate-300 text-black'}`}>
                    <div className="text-sm text-slate-400 font-medium">Account Type</div>
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                        ${form.is_premium ? 'bg-yellow-500 text-slate-900' : 'bg-blue-700 text-white'}`}>
                        {form.is_premium ? 'Premium' : 'Normal'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      {form.is_premium
                        ? 'You are a premium member with full access.'
                        : 'Upgrade to premium for exclusive features.'}
                    </div>
                  </div>
                  {/* Card 2: Next Payment Date */}
                  <div className={`rounded-xl border border-[#22304a] p-6 flex flex-col gap-2 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-slate-300 text-black'}`}>
                    <div className="text-sm text-slate-400 font-medium">Next Payment Date</div>
                    <div className="text-2xl font-bold text-white">
                      {upcomingPayments.length > 0
                        ? new Date(upcomingPayments[0].date).toLocaleDateString()
                        : 'N/A'}
                    </div>
                  </div>
                  {/* Card 3: Payment Amount */}
                  <div className={`rounded-xl border border-[#22304a] p-6 flex flex-col gap-2 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-slate-300 text-black'}`}>
                    <div className="text-sm text-slate-400 font-medium">Payment Amount</div>
                    <div className="text-2xl font-bold text-green-400">
                      {upcomingPayments.length > 0
                        ? `₹${upcomingPayments[0].amount}`
                        : 'N/A'}
                    </div>
                  </div>
                  {/* Card 4: Last Payment */}
                  <div className={`rounded-xl border border-[#22304a] p-6 flex flex-col gap-2 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-slate-300 text-black'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg text-green-400"><FaCreditCard /></span>
                      <span className="text-sm text-slate-400 font-medium">Last Payment</span>
                    </div>
                    {lastPayment ? (
                      <>
                        <div className="text-2xl font-extrabold text-green-400 mb-1">
                          ₹{lastPayment.amount}
                        </div>
                        <div className="text-sm text-blue-200 mb-1">
                          Paid on {new Date(lastPayment.date).toLocaleString()}
                        </div>
                        <div className="inline-block px-3 py-1 rounded-full bg-blue-900 text-blue-200 text-xs font-semibold">
                          {lastPayment.type ? lastPayment.type.charAt(0).toUpperCase() + lastPayment.type.slice(1) : 'Payment'}
                        </div>
                      </>
                    ) : (
                      <div className="text-slate-400">No payments yet.</div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}
          {active === 'profile' && (
            <section className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-1">Profile</h1>
              <div className="text-slate-400 text-base mb-8">Manage your personal information and settings</div>
              {/* Personal Information Card */}
              <div className={`bg-[#101c34] border border-[#22304a] rounded-2xl p-8 mb-8 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-slate-300 text-black'}`}>
                <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
                <div className="text-slate-400 mb-6">Update your personal details</div>
                <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm mb-1">Full Name</label>
                    <input
                      name="name"
                      value={form.name || ''}
                      onChange={handleChange}
                      className={`w-full rounded px-3 py-2 border ${isDarkMode ? 'border-[#22304a] bg-[#172447] text-white' : 'border-slate-300 bg-white text-black'}`}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Phone Number</label>
                    <input
                      name="user_phone"
                      value={form.user_phone || ''}
                      onChange={handleChange}
                      className={`w-full rounded px-3 py-2 border ${isDarkMode ? 'border-[#22304a] bg-[#172447] text-white' : 'border-slate-300 bg-white text-black'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Email</label>
                    <input name="email" value={form.email || ''} onChange={handleChange} className={`w-full rounded px-3 py-2 border ${isDarkMode ? 'border-[#22304a] bg-[#172447] text-white' : 'border-slate-300 bg-white text-black'}`} />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Date of Birth</label>
                    <input
                      name="dob"
                      type="date"
                      value={form.dob || ''}
                      onChange={handleChange}
                      className={`w-full rounded px-3 py-2 border ${isDarkMode ? 'border-[#22304a] bg-[#172447] text-white' : 'border-slate-300 bg-white text-black'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Age</label>
                    <input
                      name="age"
                      type="number"
                      value={form.age || ''}
                      onChange={handleChange}
                      className={`w-full rounded px-3 py-2 border ${isDarkMode ? 'border-[#22304a] bg-[#172447] text-white' : 'border-slate-300 bg-white text-black'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Gender</label>
                    <select
                      name="gender"
                      value={form.gender || ''}
                      onChange={handleChange}
                      className={`w-full rounded px-3 py-2 border ${isDarkMode ? 'border-[#22304a] bg-[#172447] text-white' : 'border-slate-300 bg-white text-black'}`}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">PAN (Optional)</label>
                    <input name="pan" value={form.pan || ''} onChange={handleChange} className={`w-full rounded px-3 py-2 border ${isDarkMode ? 'border-[#22304a] bg-[#172447] text-white' : 'border-slate-300 bg-white text-black'}`} />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Aadhar (Optional)</label>
                    <input name="aadhar" value={form.aadhar || ''} onChange={handleChange} className={`w-full rounded px-3 py-2 border ${isDarkMode ? 'border-[#22304a] bg-[#172447] text-white' : 'border-slate-300 bg-white text-black'}`} />
                  </div>
                  <div className="md:col-span-2 flex justify-start mt-2">
                    <button type="submit" className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold">Update Personal Info</button>
                  </div>
                </form>
              </div>
              {/* Change Password Card */}
              <div className={`bg-[#101c34] border border-[#22304a] rounded-2xl p-8 mb-8 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-slate-300 text-black'}`}>
                <ChangePassword isDarkMode={isDarkMode} />
              </div>
              {/* Bank Accounts List & Add/Edit Section */}
              <div className={`bg-[#101c34] border border-[#22304a] rounded-2xl p-8 mb-8 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-slate-300 text-black'}`}>
                <h2 className="text-2xl font-bold mb-2">Bank Accounts</h2>
                <div className="text-slate-400 mb-6">Manage your bank accounts (max 2)</div>
                {form.bank_accounts && form.bank_accounts.length > 0 ? (
                  form.bank_accounts.map((bank, idx) => (
                    <div key={bank.bank_id || bank._id || idx} className={`mb-6 p-6 rounded-xl border shadow flex flex-col gap-2 max-w-md ${isDarkMode ? 'bg-[#172447] border-[#22304a] text-white' : 'bg-white border-slate-300 text-black shadow-md'}`}>
                      <div className={`text-lg font-semibold mb-2 flex items-center gap-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>Bank Account Details {form.bank_accounts.length > 1 ? `#${idx + 1}` : ''}</div>
                      <div><span className="font-bold">Account Holder Name:</span> <span>{bank.account_holder_name}</span></div>
                      <div><span className="font-bold">Account Number:</span> <span>{bank.account_number}</span></div>
                      <div><span className="font-bold">Bank Name:</span> <span>{bank.bank_name}</span></div>
                      <div><span className="font-bold">IFSC:</span> <span>{bank.ifsc_code || bank.ifsc}</span></div>
                      <div><span className="font-bold">Branch:</span> <span>{bank.branch}</span></div>
                      <div className="flex gap-2 mt-3">
                        <button className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold" onClick={() => handleOpenEditBank(idx)}>Edit</button>
                        <button
                          className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold"
                          onClick={() => handleDeleteBank(bank.bank_id || bank._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="mb-6 text-slate-400">No bank accounts added yet.</div>
                )}
                {/* Add Bank Account Button */}
                {(!form.bank_accounts || form.bank_accounts.length < 2) && (
                  <button onClick={handleOpenAddBank} className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold mb-4">Add Bank Account</button>
                )}
                {/* Add/Edit Bank Account Modal/Form */}
                {showBankForm && (
                  <form
                    onSubmit={handleBankFormSubmit}
                    className={`mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-xl border
                      ${isDarkMode
                        ? 'bg-[#172447] border-[#22304a] text-white'
                        : 'bg-white border-slate-300 text-black'
                      }`}
                  >
                    <div>
                      <label className="block text-sm mb-1">Account Holder Name</label>
                      <input name="account_holder_name" value={bankForm.account_holder_name} onChange={handleBankFormChange} className={`w-full rounded px-3 py-2 border ${isDarkMode ? 'bg-[#101c34] border-[#22304a] text-white' : 'bg-white border-slate-300 text-black'}`} required />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Account Number</label>
                      <input name="account_number" value={bankForm.account_number} onChange={handleBankFormChange} className={`w-full rounded px-3 py-2 border ${isDarkMode ? 'bg-[#101c34] border-[#22304a] text-white' : 'bg-white border-slate-300 text-black'}`} required />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Account Type</label>
                      <input name="account_type" value={bankForm.account_type} onChange={handleBankFormChange} className={`w-full rounded px-3 py-2 border ${isDarkMode ? 'bg-[#101c34] border-[#22304a] text-white' : 'bg-white border-slate-300 text-black'}`} required />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Bank Name</label>
                      <input name="bank_name" value={bankForm.bank_name} onChange={handleBankFormChange} className={`w-full rounded px-3 py-2 border ${isDarkMode ? 'bg-[#101c34] border-[#22304a] text-white' : 'bg-white border-slate-300 text-black'}`} required />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">IFSC Code</label>
                      <input name="ifsc" value={bankForm.ifsc} onChange={handleBankFormChange} className={`w-full rounded px-3 py-2 border ${isDarkMode ? 'bg-[#101c34] border-[#22304a] text-white' : 'bg-white border-slate-300 text-black'}`} required />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-1">Branch Name</label>
                      <input name="branch" value={bankForm.branch} onChange={handleBankFormChange} className={`w-full rounded px-3 py-2 border ${isDarkMode ? 'bg-[#101c34] border-[#22304a] text-white' : 'bg-white border-slate-300 text-black'}`} required />
                    </div>
                    <div className="md:col-span-2 flex gap-2 mt-2">
                      <button type="submit" className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold">{editingBankIndex === null ? 'Add Bank Account' : 'Update Bank Account'}</button>
                      <button type="button" onClick={() => setShowBankForm(false)} className="px-5 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-semibold">Cancel</button>
                    </div>
                  </form>
                )}
              </div>
            </section>
          )}
          {active === 'payment' && (
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <FaCreditCard className="text-blue-400" /> Upcoming Payments
                </h2>
                <button 
                  onClick={() => {
                    const userId = currentUser.id || currentUser._id;
                    if (userId) {
                      fetchUpcomingPayments();
                    }
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
                >
                  Refresh
                </button>
              </div>
              {loading ? (
                <div className={`bg-[#101c34] border border-[#22304a] rounded-xl p-8 text-center text-slate-400 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-slate-300 text-black'}`}>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
                  Loading upcoming payments...
                </div>
              ) : upcomingPayments.length === 0 ? (
                <div className={`bg-[#101c34] border border-[#22304a] rounded-xl p-8 text-center text-slate-400 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-slate-300 text-black'}`}>
                  <FaCreditCard className="mx-auto text-4xl mb-2 text-blue-700" />
                  No upcoming payments scheduled.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className={`min-w-full rounded-xl border shadow-lg ${isDarkMode ? 'border-[#22304a] bg-[#101c34] text-white' : 'border-black bg-white text-black'}`}>
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">#</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Due Date</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingPayments.map((payment, idx) => (
                        <tr key={payment._id || payment.id || idx} className="border-t border-[#22304a] hover:bg-[#172447] transition">
                          <td className="px-6 py-4 font-mono text-blue-300">{idx + 1}</td>
                          <td className="px-6 py-4 text-green-400 font-bold">₹{payment.amount}</td>
                          <td className="px-6 py-4">{new Date(payment.date).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold
                              ${payment.status === 'pending'
                                ? 'bg-yellow-900 text-yellow-300'
                                : payment.status === 'completed'
                                ? 'bg-blue-900 text-blue-200'
                                : 'bg-slate-800 text-slate-400'
                              }`}>
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-6 flex justify-end">
                    <span className="text-xs text-slate-400">
                      Showing {upcomingPayments.length} upcoming payment{upcomingPayments.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}
              {/* Transaction History Section */}
              <section className="mt-10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Transaction History</h2>
                  <button 
                    onClick={() => {
                      const userId = currentUser.id || currentUser._id;
                      if (userId) {
                        fetchCompletedPayments();
                      }
                    }}
                    className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
                  >
                    Refresh
                  </button>
                </div>
                {loading ? (
                  <div className={`bg-[#101c34] border border-[#22304a] rounded-xl p-4 text-center text-slate-400 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-slate-300 text-black'}`}>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mx-auto mb-2"></div>
                    Loading transaction history...
                  </div>
                ) : completedPayments.length === 0 ? (
                  <div className={`bg-[#101c34] border border-[#22304a] rounded-xl p-4 text-center text-slate-400 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-slate-300 text-black'}`}>
                    No transactions found.
                  </div>
                ) : (
                  <table className={`min-w-full rounded-xl border shadow-lg ${isDarkMode ? 'border-[#22304a] bg-[#101c34] text-white' : 'border-black bg-white text-black'}`}>
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left">Amount</th>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Type</th>
                        <th className="px-4 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedPayments.map(payment => (
                        <tr key={payment._id || payment.id} className="border-t border-[#22304a]">
                          <td className="px-4 py-2">₹{payment.amount}</td>
                          <td className="px-4 py-2">{new Date(payment.date).toLocaleDateString()}</td>
                          <td className="px-4 py-2">{payment.type || '-'}</td>
                          <td className="px-4 py-2 capitalize">{payment.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </section>
              <section className="mt-10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Investment History</h2>
                  <button 
                    onClick={() => {
                      const userId = currentUser.id || currentUser._id;
                      if (userId) {
                        fetchInvestmentPayments();
                      }
                    }}
                    className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
                  >
                    Refresh
                  </button>
                </div>
                {loading ? (
                  <div className={`bg-[#101c34] border border-[#22304a] rounded-xl p-4 text-center text-slate-400 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-slate-300 text-black'}`}>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mx-auto mb-2"></div>
                    Loading Investment history...
                  </div>
                ) : investmentPayments.length === 0 ? (
                  <div className={`bg-[#101c34] border border-[#22304a] rounded-xl p-4 text-center text-slate-400 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-slate-300 text-black'}`}>
                    No investments found.
                  </div>
                ) : (
                  <table className={`min-w-full rounded-xl border shadow-lg ${isDarkMode ? 'border-[#22304a] bg-[#101c34] text-white' : 'border-black bg-white text-black'}`}>
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left">Amount</th>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Type</th>
                        <th className="px-4 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {investmentPayments.map(payment => (
                        <tr key={payment._id || payment.id} className="border-t border-[#22304a]">
                          <td className="px-4 py-2">₹{payment.amount}</td>
                          <td className="px-4 py-2">{new Date(payment.date).toLocaleDateString()}</td>
                          <td className="px-4 py-2">{payment.type || '-'}</td>
                          <td className="px-4 py-2 capitalize">{payment.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </section>
            </section>
          )}
        </main>
      </div>
      {/* Delete Bank Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-[#101c34] p-6 rounded-xl shadow-lg border border-[#22304a] max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-4 text-red-500">Delete Bank Account</h2>
            <p className="mb-6 text-slate-300">Are you sure you want to delete this bank account?</p>
            <div className="flex justify-center gap-4">
              <button
                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
                onClick={confirmDeleteBank}
              >
                Delete
              </button>
              <button
                className="px-5 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-semibold"
                onClick={() => { setShowDeleteModal(false); setBankToDelete(null); }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
