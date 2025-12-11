import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Redirect based on user role
      if (result.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/shop", { replace: true });
      }
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link
            to="/"
            className="text-4xl sm:text-5xl font-normal text-dark-grey dark:text-off-white inline-block transition-colors"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Flipcard
          </Link>
          <h2
            className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-normal text-dark-grey dark:text-off-white transition-colors"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Welcome Back
          </h2>
          <p className="mt-2 text-sm sm:text-base text-dark-grey/60 dark:text-off-white/60 font-light transition-colors">
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-off-white dark:bg-muted-slate rounded-lg p-6 sm:p-8 transition-colors">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-muted-slate/10 dark:bg-muted-slate/20 border border-muted-slate/30 text-dark-grey dark:text-off-white px-4 py-3 rounded-lg text-sm transition-colors">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div className="relative">
              <Mail
                className="absolute left-3 top-[42px] text-muted-slate pointer-events-none"
                size={18}
              />
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="pl-10"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock
                className="absolute left-3 top-[42px] text-muted-slate pointer-events-none"
                size={18}
              />
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="pl-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[42px] text-muted-slate dark:text-off-white/50 hover:text-dark-grey dark:hover:text-off-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-soft-teal hover:text-dark-grey transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                size="md"
                disabled={loading}
                className="mt-6 w-48 text-soft-teal hover:text-dark-grey transition-colors"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-dark-grey/60 dark:text-off-white/60 transition-colors">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-soft-teal hover:text-dark-grey font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
