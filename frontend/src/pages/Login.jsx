import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Login page — premium glassmorphism login with validation.
 * Demo credentials: admin / admin123
 */
function Login({ onLogin }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email or username is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Demo authentication — accepts ANY credentials for this demo
    if (formData.email && formData.password.length >= 4) {
      const user = {
        name: formData.email.split("@")[0], // Use email/username as name
        email: formData.email.includes("@") ? formData.email : `${formData.email}@taskflow.com`,
        avatar: formData.email.charAt(0).toUpperCase(),
      };
      localStorage.setItem("user", JSON.stringify(user));
      onLogin(user);
      showToast("Welcome back! 🎉");
      setTimeout(() => navigate("/"), 300);
    } else {
      showToast("Please enter valid credentials", "error");
    }

    setSubmitting(false);
  };

  return (
    <div className="login-page" id="login-page">
      {/* Decorative background shapes */}
      <div className="login-bg">
        <div className="login-bg__orb login-bg__orb--1"></div>
        <div className="login-bg__orb login-bg__orb--2"></div>
        <div className="login-bg__orb login-bg__orb--3"></div>
      </div>

      <div className="login-container">
        {/* Left side — branding panel */}
        <div className="login-branding">
          <div className="login-branding__content">
            <div className="login-branding__icon">📋</div>
            <h1 className="login-branding__title">TaskFlow</h1>
            <p className="login-branding__subtitle">
              Manage your projects with clarity and precision
            </p>
            <div className="login-branding__features">
              <div className="login-branding__feature">
                <span className="login-branding__feature-icon">✓</span>
                Create & organize tasks
              </div>
              <div className="login-branding__feature">
                <span className="login-branding__feature-icon">✓</span>
                Track progress in real-time
              </div>
              <div className="login-branding__feature">
                <span className="login-branding__feature-icon">✓</span>
                Beautiful dark & light themes
              </div>
            </div>
          </div>
        </div>

        {/* Right side — login form */}
        <div className="login-form-panel">
          <div className="login-form-card">
            <div className="login-form-header">
              <h2 className="login-form-header__title">Welcome back</h2>
              <p className="login-form-header__subtitle">
                Sign in to your account to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate id="login-form">
              {/* Email / Username */}
              <div className="form-group">
                <label className="form-label" htmlFor="login-email">
                  Email or Username
                </label>
                <div className="login-input-wrapper">
                  <span className="login-input-icon">👤</span>
                  <input
                    type="text"
                    id="login-email"
                    name="email"
                    className={`form-input login-input ${
                      errors.email ? "form-input--error" : ""
                    }`}
                    placeholder="admin"
                    value={formData.email}
                    onChange={handleChange}
                    autoFocus
                    autoComplete="username"
                  />
                </div>
                {errors.email && (
                  <div className="form-error" id="email-error">
                    ⚠ {errors.email}
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="login-password">
                  Password
                </label>
                <div className="login-input-wrapper">
                  <span className="login-input-icon">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="login-password"
                    name="password"
                    className={`form-input login-input ${
                      errors.password ? "form-input--error" : ""
                    }`}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="login-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    id="toggle-password-btn"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.password && (
                  <div className="form-error" id="password-error">
                    ⚠ {errors.password}
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn--primary btn--lg login-submit-btn"
                disabled={submitting}
                id="login-submit-btn"
              >
                {submitting ? (
                  <>
                    <span className="login-btn-spinner"></span>
                    Signing in...
                  </>
                ) : (
                  "Sign In →"
                )}
              </button>
            </form>

            {/* Demo credentials hint */}
            <div className="login-demo-hint" id="demo-hint">
              <span className="login-demo-hint__label">Demo Mode Active</span>
              <div className="login-demo-hint__creds">
                You can sign in with <strong>any</strong> username and password (min 4 chars)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`toast toast--${toast.type}`} id="toast-notification">
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default Login;
