import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import AuthService from '../../services/authService';
import { toast } from 'sonner';

export default function ChangePassword({ isDarkMode = false }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await AuthService.changePassword(newPassword, oldPassword);
      setSuccess('Password changed successfully!');
      toast.success('Password has been changed.');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col gap-6 p-6 rounded-2xl shadow-xl border transition-all duration-300 w-full max-w-md ${isDarkMode ? 'bg-slate-900 border-cyan-900 text-cyan-100' : 'bg-white border-cyan-200 text-slate-900'}`}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-xl font-bold">Change Password</h2>
        <p className={isDarkMode ? 'text-cyan-300 text-sm' : 'text-gray-600 text-sm'}>
          Enter your old and new password below.
        </p>
      </div>
      {error && (
        <div className={isDarkMode ? 'bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-md text-sm' : 'bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm'}>
          {error}
        </div>
      )}
      {success && (
        <div className={isDarkMode ? 'bg-green-900/30 border border-green-700 text-green-300 px-4 py-3 rounded-md text-sm' : 'bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm'}>
          {success}
        </div>
      )}
      <div className="grid gap-3">
        <Label htmlFor="oldPassword">Old Password</Label>
        <Input
          id="oldPassword"
          type="password"
          placeholder="Enter old password"
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)}
          required
          className={isDarkMode ? 'bg-slate-800 border-cyan-900 text-cyan-100 placeholder:text-cyan-400' : 'bg-slate-100 border-cyan-200 text-blue-900 placeholder:text-cyan-600'}
        />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
          className={isDarkMode ? 'bg-slate-800 border-cyan-900 text-cyan-100 placeholder:text-cyan-400' : 'bg-slate-100 border-cyan-200 text-blue-900 placeholder:text-cyan-600'}
        />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className={isDarkMode ? 'bg-cyan-600 hover:bg-cyan-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}
      >
        {loading ? 'Changing...' : 'Change Password'}
      </Button>
    </form>
  );
} 