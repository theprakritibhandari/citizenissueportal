import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Shield, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { adminLogin } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter administrator email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await adminLogin(email, password);
      if (res.user?.role !== 'admin') {
        toast.error('Access Denied: This account does not possess municipal administrator privileges.');
        return;
      }
      toast.success('Municipal Administrator authenticated successfully!');
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Administrator authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        backgroundColor: '#0A2540',
        backgroundImage: 'radial-gradient(circle at 50% 30%, #133E68 0%, #0A2540 100%)',
      }}
    >
      <div
        className="civic-card"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '2.5rem 2rem',
          backgroundColor: 'white',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #0A2540, #0066CC)',
              color: 'white',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              boxShadow: '0 8px 16px rgba(0, 102, 204, 0.3)',
            }}
          >
            <Shield size={30} />
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-navy)' }}>Municipal Admin Console</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            Authorized Personnel & Engineering Control Room
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label="Official Administrator Email"
            name="email"
            type="email"
            placeholder="admin@municipality.gov"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={Mail}
          />

          <div className="form-group">
            <label className="form-label" htmlFor="adminPass">
              <span>Security Access Key <span className="required">*</span></span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="adminPass"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                onClick={() => setShowPassword(!showPassword)}
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
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button type="submit" variant="primary" fullWidth size="lg" loading={loading} style={{ marginTop: '0.75rem' }}>
            Unlock Admin Console
          </Button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link to="/" style={{ fontSize: '0.85rem', color: 'var(--primary-blue)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            ← Return to Public Citizen Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
