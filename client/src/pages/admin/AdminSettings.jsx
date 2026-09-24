import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import {
  Shield,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Save,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  LogOut,
} from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export const AdminSettings = () => {
  const { user, refreshUser, logout } = useAuth();
  const toast = useToast();

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('Please provide both administrator name and official email.');
      return;
    }

    setSavingProfile(true);
    try {
      const res = await api.updateAdminProfile({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });

      if (res.success) {
        toast.success(res.message || 'Administrator profile updated successfully.');
        await refreshUser();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update administrator profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please complete all required password fields.');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long.');
      return;
    }

    const hasUpper = /[A-Z]/.test(newPassword);
    const hasLower = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword);

    if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      toast.error('Password must contain uppercase, lowercase, number, and special character.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirmation do not match.');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await api.updateAdminPassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (res.success) {
        toast.success('Security access key updated successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update security password.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="container main-content" style={{ padding: '2rem 1.5rem', maxWidth: '1000px' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #0A2540, #0066CC)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Shield size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', color: 'var(--primary-navy)', fontWeight: 800, margin: 0 }}>
              Admin Account & Security Settings
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              Manage municipal administrator identity, security credentials, and department contact info
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Profile Card */}
        <div className="civic-card" style={{ padding: '2rem', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-light)' }}>
            <User size={20} color="var(--primary-blue)" />
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Administrator Profile</h2>
          </div>

          <form onSubmit={handleProfileSubmit}>
            <Input
              label="Full Name"
              name="name"
              placeholder="e.g. Municipal Administrator"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              icon={User}
            />

            <Input
              label="Official Email Address"
              name="email"
              type="email"
              placeholder="admin@municipality.gov"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={Mail}
              helper="Used for administrative authentication and official dispatch notifications."
            />

            <Input
              label="Contact / Extension"
              name="phone"
              placeholder="+1 800-555-0199"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              icon={Phone}
            />

            <div style={{ marginTop: '1.5rem' }}>
              <Button
                type="submit"
                variant="primary"
                loading={savingProfile}
                icon={Save}
              >
                Save Profile Changes
              </Button>
            </div>
          </form>
        </div>

        {/* Security & Password Card */}
        <div className="civic-card" style={{ padding: '2rem', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-light)' }}>
            <KeyRound size={20} color="var(--primary-blue)" />
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Security & Credentials</h2>
          </div>

          <form onSubmit={handlePasswordSubmit}>
            {/* Current Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="currPass">
                <span>Current Security Password <span className="required">*</span></span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="currPass"
                  name="currentPassword"
                  type={showCurrentPass ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748B',
                    pointerEvents: 'none',
                  }}
                >
                  <Lock size={18} />
                </div>
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    cursor: 'pointer',
                  }}
                  aria-label="Toggle password visibility"
                >
                  {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="newPass">
                <span>New Security Password <span className="required">*</span></span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="newPass"
                  name="newPassword"
                  type={showNewPass ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Min. 8 characters (upper, lower, num, symbol)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748B',
                    pointerEvents: 'none',
                  }}
                >
                  <Lock size={18} />
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    cursor: 'pointer',
                  }}
                  aria-label="Toggle password visibility"
                >
                  {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="confPass">
                <span>Confirm New Password <span className="required">*</span></span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="confPass"
                  name="confirmPassword"
                  type={showConfirmPass ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748B',
                    pointerEvents: 'none',
                  }}
                >
                  <Lock size={18} />
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    cursor: 'pointer',
                  }}
                  aria-label="Toggle password visibility"
                >
                  {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <Button
                type="submit"
                variant="primary"
                loading={savingPassword}
                icon={Lock}
              >
                Update Access Password
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
