import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { User, Mail, Lock, Phone, UserPlus, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const toast = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      toast.error(t('auth.fillMandatory', 'Please fill in all mandatory fields.'));
      return;
    }

    if (formData.password.length < 6) {
      toast.error(t('auth.passwordMinLength', 'Password must be at least 6 characters long.'));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error(t('auth.passwordMismatch', 'Passwords do not match. Please verify.'));
      return;
    }

    setLoading(true);
    try {
      const res = await register(
        formData.name,
        formData.email,
        formData.password,
        formData.phone
      );
      toast.success(res.message || 'Account registered successfully!');
      navigate('/report');
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="civic-card" style={{ width: '100%', maxWidth: '480px', padding: '2.25rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #0066CC, #0A2540)',
              color: 'white',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              boxShadow: '0 4px 12px rgba(0, 102, 204, 0.25)',
            }}
          >
            <UserPlus size={26} />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.35rem' }}>{t('auth.registerTitle', 'Citizen Registration')}</h2>
          <p style={{ fontSize: '0.875rem' }}>{t('auth.registerSubtitle', 'Create an account to report public issues and track repairs')}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label={t('auth.fullName', 'Full Name')}
            name="name"
            placeholder={t('auth.fullNamePlaceholder', 'e.g. John Doe')}
            value={formData.name}
            onChange={handleChange}
            required
            icon={User}
          />

          <Input
            label={t('auth.emailAddress', 'Email Address')}
            name="email"
            type="email"
            placeholder={t('auth.emailPlaceholder', 'john@example.com')}
            value={formData.email}
            onChange={handleChange}
            required
            icon={Mail}
          />

          <Input
            label={t('auth.phoneNumber', 'Phone Number (Optional)')}
            name="phone"
            type="tel"
            placeholder="+977 98XXXXXXXX"
            value={formData.phone}
            onChange={handleChange}
            icon={Phone}
          />

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              <span>{t('auth.password', 'Password')} (min. 6 characters) <span className="required">*</span></span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder={t('auth.passwordPlaceholder', 'Create a strong password')}
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
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
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Input
            label={t('auth.confirmPassword', 'Confirm Password')}
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder={t('auth.confirmPasswordPlaceholder', 'Repeat password')}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            icon={Lock}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1rem 0 1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={16} color="#10B981" />
            <span>{t('auth.privacyNote', 'Your personal information is secure and encrypted under public privacy law.')}</span>
          </div>

          <Button type="submit" variant="primary" fullWidth size="lg" loading={loading}>
            {t('auth.createAccount', 'Create Citizen Account')}
          </Button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
          {t('auth.alreadyHaveAccount', 'Already have an account?')}{' '}
          <Link to="/login" style={{ fontWeight: 700 }}>
            {t('auth.signInHere', 'Sign In here')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
