import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaHistory, FaCrown, FaClock, FaRegFileAlt, FaCheck, FaTimes, FaRegUser } from 'react-icons/fa';
import { updatePremiumStatus } from '../../services/authService';
import paymentService from '../../services/paymentService';
import authService from '../../services/authService';
import { toast } from 'sonner';

const UserFullProfileModal = ({ user, onClose, onUserUpdate, isDarkMode = true }) => {
  const [activeTab, setActiveTab] = useState('withdrawal');
  const [paymentAmount, setPaymentAmount] = useState(user?.paymentAmount || '');
  const [nextPaymentDate, setNextPaymentDate] = useState(user?.nextPaymentDate || '');
  const [userData, setUserData] = useState(user);
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState(null);
  const [editForm, setEditForm] = useState({ amount: '', status: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    type: '', // Transaction Type
    amount: '',
    date: '',
    status: 'pending', // Default to pending
  });
  const [completedPayments, setCompletedPayments] = useState([]);
  const [editingBank, setEditingBank] = useState(false);
  const [bankForm, setBankForm] = useState({
    account_holder_name: '',
    account_number: '',
    bank_name: '',
    ifsc_code: '',
    branch: '',
    account_type: 'Savings',
  });
  const [editingBankId, setEditingBankId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);
  const [userBanks, setUserBanks] = useState([]);

  useEffect(() => {
    async function fetchPayments() {
      const userId = user.id || user._id;
      if (!userId) {
        console.warn('User ID not available for fetching payments');
        return;
      }
      
      setPaymentsLoading(true);
      try {
        // Get payments for this specific user
        const data = await paymentService.getPayments(userId);
        setPayments(data);
      } catch (err) {
        toast.error('Failed to fetch payments');
      }
      setPaymentsLoading(false);
    }
    fetchPayments();
  }, [user.id, user._id]);

  useEffect(() => {
    async function fetchCompletedPayments() {
      const userId = user.id || user._id;
      if (!userId) {
        console.warn('User ID not available for fetching completed payments');
        return;
      }
      
      setLoading(true);
      try {
        const data = await paymentService.getCompletedPayments(userId);
        setCompletedPayments(data);
      } catch (err) {
        toast.error('Failed to fetch completed payments');
      }
      setLoading(false);
    }
    fetchCompletedPayments();
  }, [user.id, user._id]);

  // Fetch latest user data (including bank details) when modal opens
  useEffect(() => {
    async function fetchUserDetails() {
      const userId = user.id || user._id;
      if (!userId) {
        console.warn('User ID not available for fetching user details');
        return;
      }
      
      try {
        const freshUser = await authService.getAllUsers();
        const userDetails = freshUser.find(u => (u.id === userId) || (u._id === userId));
        if (userDetails) {
          setUserData(userDetails); // This will have the correct premium status
          // Update bankForm with latest bank details
          const bankDetails = Array.isArray(userDetails.bank_details)
            ? userDetails.bank_details[0]
            : userDetails.bank_details;
          if (bankDetails) {
            setBankForm({
              account_holder_name: bankDetails.account_holder_name || '',
              account_number: bankDetails.account_number || '',
              bank_name: bankDetails.bank_name || '',
              ifsc_code: bankDetails.ifsc_code || bankDetails.ifsc || '',
              branch: bankDetails.branch || '',
            });
          }
        }
      } catch (err) {
        toast.error('Failed to fetch user details');
      }
    }
    fetchUserDetails();
    // eslint-disable-next-line
  }, [user.id, user._id]);

  useEffect(() => {
    async function fetchUserBanks() {
      const userId = user.id || user._id;
      if (!userId) return;
      try {
        const banks = await authService.getUserBanks(userId);
        setUserBanks(banks);
      } catch (err) {
        toast.error('Failed to fetch bank details');
      }
    }
    fetchUserBanks();
  }, [user.id, user._id]);

  // Handler to add a new payment (for "Add Transaction" button)
  const handleAddPayment = async () => {
    const amount = prompt('Enter amount:');
    const date = prompt('Enter date (YYYY-MM-DD):');
    if (!amount || !date) return;
    
    const userId = userData.id || userData._id || user.id || user._id;
    if (!userId) {
      toast.error('User ID not found. Please refresh and try again.');
      return;
    }
    
    try {
      const newPayment = await paymentService.createPayment({
        amount: Number(amount),
        date,
        status: 'pending',
        user_id: userId
      });
      setPayments((prev) => [newPayment, ...prev]);
      toast.success('Payment added!');
    } catch (err) {
      toast.error('Failed to add payment');
    }
  };

  // Handler to update a payment
  const handleEditPayment = async (id) => {
    const amount = prompt('Enter new amount:');
    if (!amount) return;
    try {
      const updated = await paymentService.updatePayment(id, { amount: Number(amount) });
      setPayments((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
      );
      toast.success('Payment updated!');
    } catch (err) {
      toast.error('Failed to update payment');
    }
  };

  // Handler to delete a payment
  const handleDeletePayment = async (payment) => {
    try {
      const paymentId = payment.id || payment._id;
      await paymentService.deletePayment(paymentId);
      setPayments((prev) => prev.filter((p) => {
        const pId = p.id || p._id;
        return pId !== paymentId;
      }));
      toast.success('Payment deleted!');
    } catch (err) {
      toast.error('Failed to delete payment: ' + err.message);
    }
  };

  // Handler to update upcoming payment info (create a new pending payment)
  const handleUpdatePayment = async () => {
    if (!paymentAmount || !nextPaymentDate) {
      toast.error('Please enter both amount and date.');
      return;
    }
    
    const userId = userData.id || userData._id || user.id || user._id;
    if (!userId) {
      toast.error('User ID not found. Please refresh and try again.');
      return;
    }
    
    try {
      const newPayment = await paymentService.createPayment({
        amount: Number(paymentAmount),
        date: nextPaymentDate,
        status: 'pending',
        user_id: userId
      });
      setPayments((prev) => [newPayment, ...prev]);
      toast.success('Upcoming payment updated in database!');
    } catch (err) {
      toast.error('Failed to update payment: ' + err.message);
    }
  };

  const handleTogglePremium = async () => {
    setLoading(true);
    console.log('Toggling premium status for user:', userData);
    try {
      // Use _id as fallback since backend returns _id, not id
      const userId = userData.id || userData._id || user.id || user._id;
      if (!userId) {
        toast.error('User ID not found. Please refresh and try again.');
        return;
      }
      
      const updated = await updatePremiumStatus(userId, !userData.is_premium,userData.premium_expiry);
      setUserData(updated);
      console.log('Updating premium status for user ID:', userId);
      
      // Notify parent of update, but do NOT close the modal
      if (typeof onUserUpdate === 'function') {
        onUserUpdate(updated);
      }
      toast.success(`User ${updated.is_premium || updated.isPremium ? 'upgraded to' : 'downgraded from'} premium successfully!`);
    } catch (err) {
      toast.error('Failed to update premium status: ' + err.message);
    }
    setLoading(false);
  };

  // Edit handler: pre-fill form with selected bank's data
  const handleEditBank = (bank) => {
    setEditingBankId(bank.bank_id || bank._id || bank.id);
    setBankForm({
      account_holder_name: bank.account_holder_name || '',
      account_number: bank.account_number || '',
      bank_name: bank.bank_name || '',
      ifsc_code: bank.ifsc_code || bank.ifsc || '',
      branch: bank.branch || '',
      account_type: bank.account_type || 'Savings',
    });
    setEditingBank(true);
  };

  // Handler to update bank details
  const handleUpdateBankDetails = async (e) => {
    e.preventDefault();
    try {
      if (editingBankId) {
        // Update existing bank
        await authService.updateBank(editingBankId, {
          account_holder_name: bankForm.account_holder_name,
          account_number: bankForm.account_number,
          bank_name: bankForm.bank_name,
          ifsc: bankForm.ifsc_code, // use 'ifsc' if that's what your backend expects
          branch: bankForm.branch,
          account_type: bankForm.account_type,
        });
        toast.success('Bank details updated!');
      } else {
        // Create new bank
        const userId = userData.id || userData._id || user.id || user._id;
        await authService.createBank({
          user_id: userId,
          account_holder_name: bankForm.account_holder_name,
          account_number: bankForm.account_number,
          bank_name: bankForm.bank_name,
          ifsc: bankForm.ifsc_code,
          branch: bankForm.branch,
          account_type: bankForm.account_type,
          aadhar: userData.aadhar || user.aadhar,
          pan: userData.pan || user.pan,
        });
        toast.success('Bank details added!');
      }
      // Refresh bank list
      const banks = await authService.getUserBanks(userData.id || userData._id || user.id || user._id);
      setUserBanks(banks);
      setEditingBank(false);
      setEditingBankId(null);
      setBankForm({
        account_holder_name: '',
        account_number: '',
        bank_name: '',
        ifsc_code: '',
        branch: '',
        account_type: 'Savings',
      });
    } catch (err) {
      toast.error('Failed to update bank details: ' + err.message);
    }
  };

  const withdrawalTransactions = [
    { id: 'TXN001', amount: '₹5,000', date: '2024-01-15', status: 'Completed' },
    { id: 'TXN002', amount: '₹3,000', date: '2024-01-10', status: 'Pending' },
  ];

  const withdrawalPayments = payments.filter(p => (p.status === 'completed' && p.type!== 'investment'));
  const upcomingPayments = payments.filter(p => p.status === 'pending');
  const investmentPayments = payments.filter(p => p.type === 'investment');

  const getBankDetails = (userData) => {
    if (Array.isArray(userData.bank_details)) {
      return userData.bank_details[0] || {};
    }
    return userData.bank_details || {};
  };

  return (
    <div className={`fixed inset-0 z-50 backdrop-blur-sm ${isDarkMode ? 'bg-black/30' : 'bg-slate-200/80'} flex justify-center items-start pt-4 sm:pt-6 lg:pt-10 overflow-y-auto px-2 sm:px-4`}>
      <div className={`w-full max-w-4xl lg:max-w-6xl ${isDarkMode ? 'bg-[#0a1627] border-[#22304a] text-white' : 'bg-white border-slate-300 text-black'} rounded-lg p-3 sm:p-4 lg:p-6 xl:p-8 shadow-xl border my-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
          <h2 className={`text-lg sm:text-xl lg:text-2xl font-bold break-words ${isDarkMode ? 'text-white' : 'text-black'}`}>User Full Profile - {user.name}</h2>
          <button onClick={onClose} className={`self-start sm:self-auto text-xs sm:text-sm px-3 sm:px-4 py-2 rounded border ${isDarkMode ? 'border-slate-500 hover:bg-slate-700 text-white' : 'border-slate-300 hover:bg-slate-200 text-black'} transition-colors`}>
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* Enhanced Personal Info Card */}
          <div className={`${isDarkMode ? 'bg-[#101c34] border-[#22304a] text-white' : 'bg-white border-slate-300 text-black'} rounded-2xl p-6 border shadow-md mb-4`}>
            <div className="flex items-center mb-4">
              <span className={`w-1.5 h-6 rounded-full mr-3 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-700'}`}></span>
              <h3 className={`text-lg font-bold tracking-wide ${isDarkMode ? 'text-white' : 'text-black'}`}>Personal Info</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
              <div><span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-700'} font-semibold`}>Name:</span><span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>{user.name}</span></div>
              <div><span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-700'} font-semibold`}>Email:</span><span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>{user.email}</span></div>
              <div><span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-700'} font-semibold`}>Phone:</span><span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>{user.user_phone || 'N/A'}</span></div>
              <div><span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-700'} font-semibold`}>DOB:</span><span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>{user.dob || 'N/A'}</span></div>
              <div><span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-700'} font-semibold`}>Age:</span><span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>{user.age || 'N/A'}</span></div>
              <div><span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-700'} font-semibold`}>Gender:</span><span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>{user.gender || 'N/A'}</span></div>
              <div><span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-700'} font-semibold`}>PAN:</span><span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>{user.pan || 'N/A'}</span></div>
              <div><span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-700'} font-semibold`}>Aadhar:</span><span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>{user.aadhar || 'N/A'}</span></div>
            </div>
          </div>

          {/* Enhanced Bank Info Card */}
          <div className={`${isDarkMode ? 'bg-[#101c34] border-[#22304a] text-white' : 'bg-white border-slate-300 text-black'} rounded-2xl p-6 border shadow-md mb-4`}>
            <div className="flex items-center mb-4">
              <span className={`w-1.5 h-6 rounded-full mr-3 ${isDarkMode ? 'bg-green-500' : 'bg-green-700'}`}></span>
              <h3 className={`text-lg font-bold tracking-wide ${isDarkMode ? 'text-white' : 'text-black'}`}>Bank Info</h3>
            </div>
            {userBanks.length === 0 ? (
              <div className={`${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>No bank details found.</div>
            ) : (
              userBanks.map((bank, idx) => (
                <div key={bank.bank_id || bank._id || idx} className={`grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 mb-4 p-2 border-b ${isDarkMode ? 'border-[#22304a]' : 'border-slate-300'} last:border-b-0`}>
                  <div><span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-700'} font-semibold`}>Account Holder:</span><span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>{bank.account_holder_name || 'N/A'}</span></div>
                  <div><span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-700'} font-semibold`}>Account Number:</span><span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>{bank.account_number || 'N/A'}</span></div>
                  <div><span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-700'} font-semibold`}>Bank Name:</span><span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>{bank.bank_name || 'N/A'}</span></div>
                  <div><span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-700'} font-semibold`}>IFSC:</span><span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>{bank.ifsc_code || bank.ifsc || 'N/A'}</span></div>
                  <div><span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-700'} font-semibold`}>Branch:</span><span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>{bank.branch || 'N/A'}</span></div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Enhanced User Role Control */}
        <div className={`${isDarkMode ? 'bg-[#101c34] border-[#22304a] text-white' : 'bg-white border-slate-300 text-black'} rounded-2xl p-6 border shadow-md mb-4 flex flex-col gap-4`}>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
              ${userData.is_premium || userData.isPremium
                ? (isDarkMode ? 'bg-yellow-400 text-slate-900' : 'bg-yellow-300 text-black')
                : (isDarkMode ? 'bg-blue-700 text-white' : 'bg-blue-200 text-blue-900')}`}
            >
              {userData.is_premium || userData.isPremium ? <FaCrown className="mr-1" /> : <FaRegUser className="mr-1" />}
              {userData.is_premium || userData.isPremium ? 'Premium' : 'Non-Premium'}
            </span>
          </div>
          {/* Premium Expiry Date Section */}
          {(userData.is_premium || userData.isPremium) && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
              <label className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'} font-semibold`}>Premium Expiry Date:</label>
              <input
                type="date"
                value={userData.premium_expiry ? userData.premium_expiry.slice(0, 10) : ''}
                onChange={e => setUserData({ ...userData, premium_expiry: e.target.value })}
                className={`${isDarkMode ? 'bg-[#172447] border-[#22304a] text-white' : 'bg-slate-100 border-slate-300 text-black'} rounded px-3 py-2 w-48`}
              />
              <button
                className={`px-3 py-2 rounded ${isDarkMode ? 'bg-blue-700 hover:bg-blue-800 text-white' : 'bg-blue-200 hover:bg-blue-300 text-blue-900'} text-xs font-semibold`}
                onClick={async () => {
                  try {
                    setLoading(true);
                    const userId = userData.id || userData._id || user.id || user._id;
                    const updated = await updatePremiumStatus(userId, true, userData.premium_expiry);
                    setUserData(updated);
                    if (typeof onUserUpdate === 'function') onUserUpdate(updated);
                    toast.success('Premium expiry date updated!');
                  } catch (err) {
                    toast.error('Failed to update expiry date: ' + err.message);
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Expiry Date'}
              </button>
            </div>
          )}
          <hr className={`${isDarkMode ? 'border-slate-700' : 'border-slate-300'}`} />
          <button
            onClick={handleTogglePremium}
            disabled={loading}
            className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-bold shadow transition
              ${isDarkMode ? 'bg-red-700 hover:bg-red-800 text-white' : 'bg-red-200 hover:bg-red-300 text-red-900'}`}
          >
            {loading
              ? 'Updating...'
              : `Toggle to ${(userData.is_premium || userData.isPremium) ? 'Non-Premium' : 'Premium'}`}
          </button>
        </div>

        <div className={`${isDarkMode ? 'bg-[#101c34] border-[#22304a] text-white' : 'bg-white border-slate-300 text-black'} rounded-xl p-4 sm:p-6 border`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className={`text-base sm:text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>Payment Management</h3>
            <button
              className={`self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-lg transition
                ${isDarkMode ? 'bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white' : 'bg-gradient-to-r from-blue-200 to-blue-100 hover:from-blue-300 hover:to-blue-200 text-blue-900'}`}
              onClick={() => setShowAddModal(true)}
            >
              <FaPlus /> Add Transaction
            </button>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
            <button onClick={() => setActiveTab('withdrawal')}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold transition-colors shadow-sm
                ${activeTab === 'withdrawal'
                  ? (isDarkMode ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-200 text-blue-900 shadow-md')
                  : (isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700')}`}
            >
              <FaHistory /> Withdrawal History
            </button>
            <button onClick={() => setActiveTab('premium')}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold transition-colors shadow-sm
                ${activeTab === 'premium'
                  ? (isDarkMode ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-200 text-blue-900 shadow-md')
                  : (isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700')}`}
            >
              <FaCrown /> Premium History
            </button>
            <button onClick={() => setActiveTab('upcoming')}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold transition-colors shadow-sm
                ${activeTab === 'upcoming'
                  ? (isDarkMode ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-200 text-blue-900 shadow-md')
                  : (isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700')}`}
            >
              <FaClock /> Upcoming Payment Details
            </button>
            <button onClick={() => setActiveTab('investment')}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold transition-colors shadow-sm
                ${activeTab === 'investment'
                  ? (isDarkMode ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-200 text-blue-900 shadow-md')
                  : (isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700')}`}
            >
              <FaClock /> Investment
            </button>
          </div>

          {/* Table Section: withdrawal */}
          {activeTab === 'withdrawal' && (
            <div className="overflow-x-auto">
              <table className={`min-w-full table-fixed text-xs sm:text-sm ${isDarkMode ? 'bg-[#101c34] text-white' : 'bg-white text-black'}`}>
                <colgroup>
                  <col className="w-[20%]" />
                  <col className="w-[20%]" />
                  <col className="w-[20%]" />
                  <col className="w-[20%]" />
                  <col className="w-[20%]" />
                </colgroup>
                <thead>
                  <tr className={`${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}> 
                    <th className="px-2 sm:px-3 py-2 text-left">Transaction ID</th>
                    <th className="px-2 sm:px-3 py-2 text-left">Amount</th>
                    <th className="px-2 sm:px-3 py-2 text-left">Date</th>
                    <th className="px-2 sm:px-3 py-2 text-left">Status</th>
                    <th className="px-2 sm:px-3 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentsLoading ? (
                    <tr>
                      <td colSpan={5} className="text-center">Loading...</td>
                    </tr>
                  ) : withdrawalPayments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className={`text-center py-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                        <FaRegFileAlt className={`mx-auto mb-2 text-2xl ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                        No transactions found.
                      </td>
                    </tr>
                  ) : (
                    withdrawalPayments.map((txn) => {
                      const paymentId = txn._id || txn.id;
                      return editingPaymentId === paymentId ? (
                        <tr key={paymentId} className={`${isDarkMode ? 'border-t border-[#22304a] bg-[#172447]' : 'border-t border-slate-300 bg-slate-100'}`}>
                          <td className="px-2 sm:px-3 py-2 font-mono text-blue-300">{(txn.type || paymentId).toString().slice(-6)}</td>
                          <td className="px-2 sm:px-3 py-2">
                            <input
                              type="number"
                              value={editForm.amount}
                              onChange={e => setEditForm({ ...editForm, amount: e.target.value })}
                              className={`rounded px-2 py-1 w-20 ${isDarkMode ? 'bg-[#101c34] border-[#22304a] text-white' : 'bg-white border-slate-300 text-black'} border`}
                            />
                          </td>
                          <td className="px-2 sm:px-3 py-2">
                            <input
                              type="date"
                              value={editForm.date}
                              onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                              className={`rounded px-2 py-1 ${isDarkMode ? 'bg-[#101c34] border-[#22304a] text-white' : 'bg-white border-slate-300 text-black'} border`}
                            />
                          </td>
                          <td className="px-2 sm:px-3 py-2">
                            <select
                              value={editForm.status}
                              onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                              className={`rounded px-2 py-1 ${isDarkMode ? 'bg-[#101c34] border-[#22304a] text-white' : 'bg-white border-slate-300 text-black'} border`}
                            >
                              <option value="pending">Pending</option>
                              <option value="scheduled">Scheduled</option>
                              <option value="completed">Completed</option>
                              <option value="failed">Failed</option>
                            </select>
                          </td>
                          <td className="px-2 sm:px-3 py-2 flex gap-1 sm:gap-2">
                            <button
                              className={`p-1 rounded ${isDarkMode ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-200 hover:bg-green-300 text-green-900'} text-xs transition-colors`}
                              onClick={async () => {
                                try {
                                  const updated = await paymentService.updatePayment(paymentId, {
                                    amount: Number(editForm.amount),
                                    date: editForm.date,
                                    status: editForm.status,
                                    type: txn.type,
                                    user_id: txn.user_id || userData.id || userData._id,
                                  });
                                  setPayments((prev) =>
                                    prev.map((p) => ((p._id || p.id) === paymentId ? { ...p, ...updated } : p))
                                  );
                                  setEditingPaymentId(null);
                                  toast.success('Payment updated!');
                                } catch (err) {
                                  toast.error('Failed to update payment: ' + err.message);
                                }
                              }}
                            >
                              <FaCheck className="text-xs" />
                            </button>
                            <button
                              className={`p-1 rounded ${isDarkMode ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'} text-xs transition-colors`}
                              onClick={() => setEditingPaymentId(null)}
                            >
                              <FaTimes className="text-xs" />
                            </button>
                          </td>
                        </tr>
                      ) : (
                        <tr key={paymentId} className={`border-t ${isDarkMode ? 'border-[#22304a] hover:bg-[#18294a]' : 'border-slate-300 hover:bg-slate-100'}` + (editingPaymentId === paymentId ? (isDarkMode ? ' ring-2 ring-blue-400' : ' ring-2 ring-blue-300') : '')}>
                          <td className="px-2 sm:px-3 py-2 font-mono break-all">{txn.type || paymentId.toString().slice(-6)}</td>
                          <td className="px-2 sm:px-3 py-2 font-mono">₹{txn.amount}</td>
                          <td className="px-2 sm:px-3 py-2">{new Date(txn.date).toLocaleDateString()}</td>
                          <td className="px-2 sm:px-3 py-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold
                              ${txn.status === 'completed'
                                ? (isDarkMode ? 'bg-green-700 text-green-200' : 'bg-green-200 text-green-900')
                                : txn.status === 'pending'
                                ? (isDarkMode ? 'bg-yellow-700 text-yellow-200' : 'bg-yellow-200 text-yellow-900')
                                : (isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700')
                              }`}>
                              {txn.status}
                            </span>
                          </td>
                          <td className="px-2 sm:px-3 py-2 flex gap-1 sm:gap-2">
                            <button
                              className={`p-1 rounded ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-200 hover:bg-blue-300 text-blue-900'} text-xs transition-colors`}
                              onClick={() => {
                                setEditingPaymentId(paymentId);
                                setEditForm({
                                  amount: txn.amount,
                                  date: txn.date ? txn.date.slice(0, 10) : '',
                                  status: txn.status,
                                });
                              }}
                            >
                              <FaEdit className="text-xs" />
                            </button>
                            <button
                              className={`p-1 rounded ${isDarkMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-200 hover:bg-red-300 text-red-900'} text-xs transition-colors`}
                              onClick={() => { setPaymentToDelete(txn); setShowDeleteModal(true); }}
                            >
                              <FaTrash className="text-xs" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Section: upcoming */}
          {activeTab === 'upcoming' && (
            <div className="overflow-x-auto">
              <table className={`min-w-full table-fixed text-xs sm:text-sm ${isDarkMode ? 'bg-[#101c34] text-white' : 'bg-white text-black'}`}>
                <colgroup>
                  <col className="w-[20%]" />
                  <col className="w-[20%]" />
                  <col className="w-[20%]" />
                  <col className="w-[20%]" />
                  <col className="w-[20%]" />
                </colgroup>
                <thead>
                  <tr className={`${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}> 
                    <th className="px-2 sm:px-3 py-2 text-left">Transaction ID</th>
                    <th className="px-2 sm:px-3 py-2 text-left">Amount</th>
                    <th className="px-2 sm:px-3 py-2 text-left">Date</th>
                    <th className="px-2 sm:px-3 py-2 text-left">Status</th>
                    <th className="px-2 sm:px-3 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentsLoading ? (
                    <tr>
                      <td colSpan={5} className="text-center">Loading...</td>
                    </tr>
                  ) : upcomingPayments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className={`text-center py-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                        <FaRegFileAlt className={`mx-auto mb-2 text-2xl ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                        No transactions found.
                      </td>
                    </tr>
                  ) : (
                    upcomingPayments.map((txn) => {
                      const paymentId = txn._id || txn.id;
                      return editingPaymentId === paymentId ? (
                        <tr key={paymentId} className={`${isDarkMode ? 'border-t border-[#22304a] bg-[#172447]' : 'border-t border-slate-300 bg-slate-100'}`}>
                          <td className="px-2 sm:px-3 py-2 font-mono text-blue-300">{(txn.type || paymentId).toString().slice(-6)}</td>
                          <td className="px-2 sm:px-3 py-2">
                            <input
                              type="number"
                              value={editForm.amount}
                              onChange={e => setEditForm({ ...editForm, amount: e.target.value })}
                              className={`rounded px-2 py-1 w-20 ${isDarkMode ? 'bg-[#101c34] border-[#22304a] text-white' : 'bg-white border-slate-300 text-black'} border`}
                            />
                          </td>
                          <td className="px-2 sm:px-3 py-2">
                            <input
                              type="date"
                              value={editForm.date}
                              onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                              className={`rounded px-2 py-1 ${isDarkMode ? 'bg-[#101c34] border-[#22304a] text-white' : 'bg-white border-slate-300 text-black'} border`}
                            />
                          </td>
                          <td className="px-2 sm:px-3 py-2">
                            <select
                              value={editForm.status}
                              onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                              className={`rounded px-2 py-1 ${isDarkMode ? 'bg-[#101c34] border-[#22304a] text-white' : 'bg-white border-slate-300 text-black'} border`}
                            >
                              <option value="pending">Pending</option>
                              <option value="scheduled">Scheduled</option>
                              <option value="completed">Completed</option>
                              <option value="failed">Failed</option>
                            </select>
                          </td>
                          <td className="px-2 sm:px-3 py-2 flex gap-1 sm:gap-2">
                            <button
                              className={`p-1 rounded ${isDarkMode ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-200 hover:bg-green-300 text-green-900'} text-xs transition-colors`}
                              onClick={async () => {
                                try {
                                  const updated = await paymentService.updatePayment(paymentId, {
                                    amount: Number(editForm.amount),
                                    date: editForm.date,
                                    status: editForm.status,
                                    type: txn.type,
                                    user_id: txn.user_id || userData.id || userData._id,
                                  });
                                  setPayments((prev) =>
                                    prev.map((p) => ((p._id || p.id) === paymentId ? { ...p, ...updated } : p))
                                  );
                                  setEditingPaymentId(null);
                                  toast.success('Payment updated!');
                                } catch (err) {
                                  toast.error('Failed to update payment: ' + err.message);
                                }
                              }}
                            >
                              <FaCheck className="text-xs" />
                            </button>
                            <button
                              className={`p-1 rounded ${isDarkMode ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'} text-xs transition-colors`}
                              onClick={() => setEditingPaymentId(null)}
                            >
                              <FaTimes className="text-xs" />
                            </button>
                          </td>
                        </tr>
                      ) : (
                        <tr key={paymentId} className={`border-t ${isDarkMode ? 'border-[#22304a] hover:bg-[#18294a]' : 'border-slate-300 hover:bg-slate-100'}` + (editingPaymentId === paymentId ? (isDarkMode ? ' ring-2 ring-blue-400' : ' ring-2 ring-blue-300') : '')}>
                          <td className="px-2 sm:px-3 py-2 font-mono break-all">{txn.type || paymentId.toString().slice(-6)}</td>
                          <td className="px-2 sm:px-3 py-2 font-mono">₹{txn.amount}</td>
                          <td className="px-2 sm:px-3 py-2">{new Date(txn.date).toLocaleDateString()}</td>
                          <td className="px-2 sm:px-3 py-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold
                              ${txn.status === 'completed'
                                ? (isDarkMode ? 'bg-green-700 text-green-200' : 'bg-green-200 text-green-900')
                                : txn.status === 'pending'
                                ? (isDarkMode ? 'bg-yellow-700 text-yellow-200' : 'bg-yellow-200 text-yellow-900')
                                : (isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700')
                              }`}>
                              {txn.status}
                            </span>
                          </td>
                          <td className="px-2 sm:px-3 py-2 flex gap-1 sm:gap-2">
                            <button
                              className={`p-1 rounded ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-200 hover:bg-blue-300 text-blue-900'} text-xs transition-colors`}
                              onClick={() => {
                                setEditingPaymentId(paymentId);
                                setEditForm({
                                  amount: txn.amount,
                                  date: txn.date ? txn.date.slice(0, 10) : '',
                                  status: txn.status,
                                });
                              }}
                            >
                              <FaEdit className="text-xs" />
                            </button>
                            <button
                              className={`p-1 rounded ${isDarkMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-200 hover:bg-red-300 text-red-900'} text-xs transition-colors`}
                              onClick={() => { setPaymentToDelete(txn); setShowDeleteModal(true); }}
                            >
                              <FaTrash className="text-xs" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Section: investment */}
          {activeTab === 'investment' && (
            <div className="overflow-x-auto">
              <table className={`min-w-full table-fixed text-xs sm:text-sm ${isDarkMode ? 'bg-[#101c34] text-white' : 'bg-white text-black'}`}>
                <colgroup>
                  <col className="w-[20%]" />
                  <col className="w-[20%]" />
                  <col className="w-[20%]" />
                  <col className="w-[20%]" />
                  <col className="w-[20%]" />
                </colgroup>
                <thead>
                  <tr className={`${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}> 
                    <th className="px-2 sm:px-3 py-2 text-left">Transaction ID</th>
                    <th className="px-2 sm:px-3 py-2 text-left">Amount</th>
                    <th className="px-2 sm:px-3 py-2 text-left">Date</th>
                    <th className="px-2 sm:px-3 py-2 text-left">Status</th>
                    <th className="px-2 sm:px-3 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentsLoading ? (
                    <tr>
                      <td colSpan={5} className="text-center">Loading...</td>
                    </tr>
                  ) : investmentPayments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className={`text-center py-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                        <FaRegFileAlt className={`mx-auto mb-2 text-2xl ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                        No transactions found.
                      </td>
                    </tr>
                  ) : (
                    investmentPayments.map((txn) => {
                      const paymentId = txn._id || txn.id;
                      return editingPaymentId === paymentId ? (
                        <tr key={paymentId} className={`${isDarkMode ? 'border-t border-[#22304a] bg-[#172447]' : 'border-t border-slate-300 bg-slate-100'}`}>
                          <td className="px-2 sm:px-3 py-2 font-mono text-blue-300">{(txn.type || paymentId).toString().slice(-6)}</td>
                          <td className="px-2 sm:px-3 py-2">
                            <input
                              type="number"
                              value={editForm.amount}
                              onChange={e => setEditForm({ ...editForm, amount: e.target.value })}
                              className={`rounded px-2 py-1 w-20 ${isDarkMode ? 'bg-[#101c34] border-[#22304a] text-white' : 'bg-white border-slate-300 text-black'} border`}
                            />
                          </td>
                          <td className="px-2 sm:px-3 py-2">
                            <input
                              type="date"
                              value={editForm.date}
                              onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                              className={`rounded px-2 py-1 ${isDarkMode ? 'bg-[#101c34] border-[#22304a] text-white' : 'bg-white border-slate-300 text-black'} border`}
                            />
                          </td>
                          <td className="px-2 sm:px-3 py-2">
                            <select
                              value={editForm.status}
                              onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                              className={`rounded px-2 py-1 ${isDarkMode ? 'bg-[#101c34] border-[#22304a] text-white' : 'bg-white border-slate-300 text-black'} border`}
                            >
                              <option value="pending">Pending</option>
                              <option value="scheduled">Scheduled</option>
                              <option value="completed">Completed</option>
                              <option value="failed">Failed</option>
                            </select>
                          </td>
                          <td className="px-2 sm:px-3 py-2 flex gap-1 sm:gap-2">
                            <button
                              className={`p-1 rounded ${isDarkMode ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-200 hover:bg-green-300 text-green-900'} text-xs transition-colors`}
                              onClick={async () => {
                                try {
                                  const updated = await paymentService.updatePayment(paymentId, {
                                    amount: Number(editForm.amount),
                                    date: editForm.date,
                                    status: editForm.status,
                                    type: txn.type,
                                    user_id: txn.user_id || userData.id || userData._id,
                                  });
                                  setPayments((prev) =>
                                    prev.map((p) => ((p._id || p.id) === paymentId ? { ...p, ...updated } : p))
                                  );
                                  setEditingPaymentId(null);
                                  toast.success('Payment updated!');
                                } catch (err) {
                                  toast.error('Failed to update payment: ' + err.message);
                                }
                              }}
                            >
                              <FaCheck className="text-xs" />
                            </button>
                            <button
                              className={`p-1 rounded ${isDarkMode ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'} text-xs transition-colors`}
                              onClick={() => setEditingPaymentId(null)}
                            >
                              <FaTimes className="text-xs" />
                            </button>
                          </td>
                        </tr>
                      ) : (
                        <tr key={paymentId} className={`border-t ${isDarkMode ? 'border-[#22304a] hover:bg-[#18294a]' : 'border-slate-300 hover:bg-slate-100'}` + (editingPaymentId === paymentId ? (isDarkMode ? ' ring-2 ring-blue-400' : ' ring-2 ring-blue-300') : '')}>
                          <td className="px-2 sm:px-3 py-2 font-mono break-all">{txn.type || paymentId.toString().slice(-6)}</td>
                          <td className="px-2 sm:px-3 py-2 font-mono">₹{txn.amount}</td>
                          <td className="px-2 sm:px-3 py-2">{new Date(txn.date).toLocaleDateString()}</td>
                          <td className="px-2 sm:px-3 py-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold
                              ${txn.status === 'completed'
                                ? (isDarkMode ? 'bg-green-700 text-green-200' : 'bg-green-200 text-green-900')
                                : txn.status === 'pending'
                                ? (isDarkMode ? 'bg-yellow-700 text-yellow-200' : 'bg-yellow-200 text-yellow-900')
                                : (isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700')
                              }`}>
                              {txn.status}
                            </span>
                          </td>
                          <td className="px-2 sm:px-3 py-2 flex gap-1 sm:gap-2">
                            <button
                              className={`p-1 rounded ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-200 hover:bg-blue-300 text-blue-900'} text-xs transition-colors`}
                              onClick={() => {
                                setEditingPaymentId(paymentId);
                                setEditForm({
                                  amount: txn.amount,
                                  date: txn.date ? txn.date.slice(0, 10) : '',
                                  status: txn.status,
                                });
                              }}
                            >
                              <FaEdit className="text-xs" />
                            </button>
                            <button
                              className={`p-1 rounded ${isDarkMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-200 hover:bg-red-300 text-red-900'} text-xs transition-colors`}
                              onClick={() => { setPaymentToDelete(txn); setShowDeleteModal(true); }}
                            >
                              <FaTrash className="text-xs" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {showAddModal && (
            <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex justify-center items-start pt-4 sm:pt-6 lg:pt-10 overflow-y-auto px-2 sm:px-4">
              <div className="w-full max-w-md bg-[#0a1627] rounded-lg p-6 shadow-xl border border-[#22304a] my-4">
                <h3 className="text-lg font-bold text-white mb-4">Add New Transaction</h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (!addForm.type || !addForm.amount || !addForm.date || !addForm.status) {
                    toast.error('Please fill in all fields including status.');
                    return;
                  }
                  
                  const userId = userData.id || userData._id || user.id || user._id;
                  if (!userId) {
                    toast.error('User ID not found. Please refresh and try again.');
                    return;
                  }
                  
                  try {
                    console.log('Creating payment with userId:', userId);
                    const newPayment = await paymentService.createPayment({
                      type: addForm.type,
                      amount: Number(addForm.amount),
                      date: addForm.date,
                      status: addForm.status,
                      user_id: userId
                    });
                    setPayments((prev) => [newPayment, ...prev]);
                    setShowAddModal(false);
                    toast.success('Payment added!');
                  } catch (err) {
                    toast.error('Failed to add payment: ' + err.message);
                  }
                }} className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-slate-400 font-semibold">Type:</label>
                    <select
                      className="bg-[#0e1a2f] border border-[#22304a] rounded px-3 py-2 text-white w-full"
                      value={addForm.type}
                      onChange={e => setAddForm({ ...addForm, type: e.target.value })}
                    >
                      <option value="">Select Type</option>
                      <option value="withdrawal">Withdrawal</option>
                      <option value="premium">Premium</option>
                      <option value="upcoming">Upcoming Payment</option>
                      <option value="investment">Investment</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 font-semibold">Amount:</label>
                    <input
                      type="number"
                      className="bg-[#0e1a2f] border border-[#22304a] rounded px-3 py-2 text-white w-full"
                      value={addForm.amount}
                      onChange={e => setAddForm({ ...addForm, amount: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-semibold">Date:</label>
                    <input
                      type="date"
                      className="bg-[#0e1a2f] border border-[#22304a] rounded px-3 py-2 text-white w-full"
                      value={addForm.date}
                      onChange={e => setAddForm({ ...addForm, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-semibold">Status:</label>
                    <select
                      className="bg-[#0e1a2f] border border-[#22304a] rounded px-3 py-2 text-white w-full"
                      value={addForm.status}
                      onChange={e => setAddForm({ ...addForm, status: e.target.value })}
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="pending">Pending</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                  <button type="submit" className="px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 text-white font-semibold">Add Payment</button>
                  <button type="button" className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white font-semibold" onClick={() => setShowAddModal(false)}>Cancel</button>
                </form>
              </div>
            </div>
          )}

          {showDeleteModal && paymentToDelete && (
            <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex justify-center items-start pt-4 sm:pt-6 lg:pt-10 overflow-y-auto px-2 sm:px-4">
              <div className="w-full max-w-md bg-[#0a1627] rounded-lg p-6 shadow-xl border border-[#22304a] my-4">
                <h3 className="text-lg font-bold text-white mb-4">Confirm Deletion</h3>
                <p className="text-slate-300 mb-4">Are you sure you want to delete this payment?</p>
                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 rounded bg-red-700 hover:bg-red-800 text-white font-semibold"
                    onClick={() => {
                      handleDeletePayment(paymentToDelete);
                      setShowDeleteModal(false);
                    }}
                  >
                    Delete
                  </button>
                  <button
                    className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white font-semibold"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserFullProfileModal;