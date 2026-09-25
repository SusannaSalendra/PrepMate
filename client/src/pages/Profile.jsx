import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Calendar, Lock, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import api from '../api/axios';

export const Profile = () => {
  const { user, updateUserData } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMsg('New password and confirmation do not match');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters');
      return;
    }

    setSaving(true);
    try {
      const payload = { name, email };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await api.put('/users/profile', payload);
      if (res.data?.success) {
        setSuccessMsg('Profile updated successfully!');
        updateUserData(res.data.data);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || err.customMessage || 'Failed to update profile'
      );
    } finally {
      setSaving(false);
    }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-[#20B2AA]/15">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#20B2AA]/10 border border-[#20B2AA]/20 text-[#3FD1C7] text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Account Settings</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#F9FBFB] tracking-tight flex items-center gap-3">
          <User className="w-8 h-8 text-[#20B2AA]" />
          <span>My Profile & Settings</span>
        </h1>
        <p className="text-sm text-[#8EA3A0] mt-1">
          Manage your personal account preferences and security credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* User Card Sidebar */}
        <div className="md:col-span-4 space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-[#20B2AA]/15 text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#0E6E68] to-[#20B2AA] flex items-center justify-center text-[#0D1614] text-3xl font-display font-bold mx-auto mb-4 shadow-xl shadow-[#20B2AA]/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h2 className="text-lg font-display font-bold text-[#F9FBFB]">{user?.name}</h2>
            <p className="text-xs text-[#8EA3A0] mb-4 truncate">{user?.email}</p>

            <div className="pt-4 border-t border-[#20B2AA]/15 space-y-2.5 text-left text-xs">
              <div className="flex items-center justify-between text-[#8EA3A0]">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#20B2AA]" />
                  Account Role
                </span>
                <span className="capitalize font-bold px-2.5 py-0.5 rounded-full bg-[#20B2AA]/15 text-[#3FD1C7] border border-[#20B2AA]/25">
                  {user?.role}
                </span>
              </div>

              <div className="flex items-center justify-between text-[#8EA3A0]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#20B2AA]" />
                  Member Since
                </span>
                <span className="font-medium text-[#F1F3F2]">{memberSince}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-8">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-[#20B2AA]/15">
            {successMsg && (
              <div className="mb-6 p-4 rounded-xl bg-[#20B2AA]/15 border border-[#20B2AA]/30 flex items-center gap-3 text-[#3FD1C7] text-xs animate-in fade-in">
                <CheckCircle className="w-4 h-4 text-[#20B2AA] shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-300 text-xs animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-sm font-display font-bold text-[#F9FBFB] mb-4">Personal Details</h3>
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-[#8EA3A0] uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-[#10201D] border border-[#20B2AA]/20 text-[#F1F3F2] text-sm focus:outline-none focus:border-[#20B2AA] focus:ring-1 focus:ring-[#20B2AA] transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-[#8EA3A0] uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-[#10201D] border border-[#20B2AA]/20 text-[#F1F3F2] text-sm focus:outline-none focus:border-[#20B2AA] focus:ring-1 focus:ring-[#20B2AA] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div className="pt-6 border-t border-[#20B2AA]/15">
                <h3 className="text-sm font-display font-bold text-[#F9FBFB] mb-1">Change Password</h3>
                <p className="text-xs text-[#8EA3A0] mb-4">
                  Leave blank if you do not wish to change your current password.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#8EA3A0] uppercase tracking-wider mb-1.5">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl bg-[#10201D] border border-[#20B2AA]/20 text-[#F1F3F2] placeholder-[#8EA3A0]/60 text-sm focus:outline-none focus:border-[#20B2AA] focus:ring-1 focus:ring-[#20B2AA] transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#8EA3A0] uppercase tracking-wider mb-1.5">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-xl bg-[#10201D] border border-[#20B2AA]/20 text-[#F1F3F2] placeholder-[#8EA3A0]/60 text-sm focus:outline-none focus:border-[#20B2AA] focus:ring-1 focus:ring-[#20B2AA] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#8EA3A0] uppercase tracking-wider mb-1.5">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-xl bg-[#10201D] border border-[#20B2AA]/20 text-[#F1F3F2] placeholder-[#8EA3A0]/60 text-sm focus:outline-none focus:border-[#20B2AA] focus:ring-1 focus:ring-[#20B2AA] transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-xl bg-[#20B2AA] hover:bg-[#3FD1C7] text-[#0D1614] text-xs font-bold shadow-lg shadow-[#20B2AA]/20 transition-all disabled:opacity-50 hover:-translate-y-0.5"
                >
                  {saving ? 'Saving changes...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
