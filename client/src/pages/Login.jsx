import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import Button from '../components/common/Button';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const { login } = useAuth();
  const toast = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // If redirecting from a citizen protected route, return to it; otherwise go to /my-reports
  const from =
    location.state?.from?.pathname && !location.state.from.pathname.startsWith('/admin')
      ? location.state.from.pathname
      : '/my-reports';

  const validateEmail = (val) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!val) {
      setEmailError(t('auth.emailRequired', 'Email address is required.'));
      return false;
    }
    if (!emailRegex.test(val)) {
      setEmailError(t('auth.validEmail', 'Please enter a valid email address.'));
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (emailError) validateEmail(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEmailValid = validateEmail(email.trim());
    if (!isEmailValid) {
      toast.error(t('auth.validEmail', 'Please provide a valid email address.'));
      return;
    }

    if (!password) {
      toast.error(t('auth.passwordRequired', 'Please enter your password.'));
      return;
    }

    setLoading(true);
    try {
      const res = await login(email.trim(), password);
      toast.success(res.message || t('auth.loginSuccess', 'Signed in successfully! Welcome back.'));
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Authentication failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container main-content animate-fade-in"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '72vh',
        padding: '2rem 1rem',
      }}
    >
      <div
        className="civic-card"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '2.5rem 2rem',
          boxShadow: 'var(--shadow-lg)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #0066CC, #0A2540)',
              color: 'white',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              boxShadow: '0 4px 14px rgba(0, 102, 204, 0.25)',
            }}
          >
            <LogIn size={24} />
          </div>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--primary-navy)', fontWeight: 800, margin: 0 }}>
            {t('auth.loginTitle', 'Citizen Portal Sign In')}
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.4rem', margin: 0 }}>
            {t('auth.loginSubtitle', 'Sign in to report and track civic issues.')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Email Address */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" htmlFor="email">
              <span>
                {t('auth.emailAddress', 'Email Address')} <span className="required">*</span>
              </span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="email"
                name="email"
                type="email"
                className={`form-input ${emailError ? 'has-error' : ''}`}
                placeholder={t('auth.emailPlaceholder', 'Enter your email address')}
                value={email}
                onChange={handleEmailChange}
                onBlur={() => validateEmail(email.trim())}
                required
                autoComplete="email"
                style={{ paddingLeft: '2.5rem' }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: emailError ? '#DC2626' : '#64748B',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Mail size={18} />
              </div>
            </div>
            {emailError && (
              <span className="form-error" style={{ fontSize: '0.775rem', color: '#DC2626', marginTop: '0.25rem', display: 'block' }}>
                {emailError}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" htmlFor="password">
              <span>
                {t('auth.password', 'Password')} <span className="required">*</span>
              </span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder={t('auth.passwordPlaceholder', 'Enter your password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
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
                  display: 'flex',
                  alignItems: 'center',
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
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            loading={loading}
            style={{ marginTop: '0.5rem' }}
          >
            {loading ? t('auth.signingIn', 'Signing In...') : t('auth.signIn', 'Sign In')}
          </Button>
        </form>

        {/* Footer Link to Registration */}
        <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {t('auth.dontHaveAccount', "Don't have an account?")}{' '}
          <Link
            to="/register"
            style={{
              fontWeight: 700,
              color: 'var(--primary-blue)',
              textDecoration: 'none',
            }}
          >
            {t('auth.registerAsCitizen', 'Register as a Citizen')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
