import { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import logo from '../../assets/Rehana_Medicals-removebg-preview.png'; // Update with your actual logo file name/path
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const user = await login(email, password);

      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'pharmacist') {
        navigate('/pharmacist/dashboard');
      } else {
        navigate('/customer/home');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-wrapper">
      {/* Background ambient lighting effects */}
      <div className="glow-circle top-left"></div>
      <div className="glow-circle bottom-right"></div>

      <div className="login-card">
        <div className="login-header">
          {/* Logo Display */}
          <div className="logo-container">
            <img src={logo} alt="Rehana Medicals Logo" className="brand-logo" />
          </div>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="e.g. admin@rehanamedicals.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={isSubmitting} className="submit-btn">
            {isSubmitting ? (
              <span className="btn-loader">Authenticating...</span>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="form-actions-secondary">
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot Password?
            </Link>
            
            <div className="signup-prompt">
              <span>Don't have an account?</span>{' '}
              <Link to="/signup" className="signup-link">
                Sign Up
              </Link>
            </div>
          </div>

        </form>

        <div className="login-footer">
          <p>© {new Date().getFullYear()} Rehana Medicals. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;