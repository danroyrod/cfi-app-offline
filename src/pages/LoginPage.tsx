import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './LoginPage.css';

interface LoginPageProps {
  returnTo?: string;
}

export default function LoginPage({ returnTo }: LoginPageProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Use returnTo prop, location state, or default to home
  const redirectTo = returnTo || (location.state as { from?: string })?.from || '/';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 300));

    const success = login(password);
    
    if (success) {
      // Redirect to the protected page or home
      navigate(redirectTo, { replace: true });
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">🔒</div>
            <h1 className="login-title">Protected Content</h1>
            <p className="login-subtitle">
              This section requires a password to access
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-input-group">
              <label htmlFor="password" className="login-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className={`login-input ${error ? 'login-input-error' : ''}`}
                placeholder="Enter password"
                autoFocus
                disabled={isLoading}
              />
              {error && <div className="login-error">{error}</div>}
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={isLoading || !password.trim()}
            >
              {isLoading ? 'Verifying...' : 'Access Content'}
            </button>
          </form>

          <div className="login-footer">
            <p className="login-footer-text">
              This password protects lesson plans and audio lessons.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
