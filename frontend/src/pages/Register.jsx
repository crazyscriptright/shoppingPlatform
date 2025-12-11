import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, Calendar } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import api from "../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        dob: formData.dob,
        password: formData.password,
      });

      if (response.data.token) {
        // Redirect to login page after successful registration
        navigate("/login", {
          state: { message: "Registration successful! Please login." },
        });
      }
    } catch (error) {
      setError(
        error.response?.data?.error || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F5F3EF] flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link
            to="/"
            className="text-4xl sm:text-5xl font-normal text-dark-grey inline-block"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Flipcard
          </Link>
          <h2
            className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-normal text-dark-grey"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Create Account
          </h2>
          <p className="mt-2 text-sm sm:text-base text-dark-grey/60 font-light">
            Sign up to start shopping
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-off-white rounded-lg p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-muted-slate/10 border border-muted-slate/30 text-dark-grey px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Name Input */}
            <div className="relative">
              <User
                className="absolute left-3 top-[42px] text-muted-slate pointer-events-none"
                size={18}
              />
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="pl-10"
              />
            </div>

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

            {/* Date of Birth Input */}
            <div className="relative">
              <Calendar
                className="absolute left-3 top-[42px] text-muted-slate pointer-events-none"
                size={18}
              />
              <Input
                label="Date of Birth"
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
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
                className="absolute right-3 top-[42px] text-muted-slate hover:text-dark-grey transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <Lock
                className="absolute left-3 top-[42px] text-muted-slate pointer-events-none"
                size={18}
              />
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="pl-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-[42px] text-muted-slate hover:text-dark-grey transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                required
                className="rounded border-warm-grey/50 text-soft-teal focus:ring-soft-teal w-4 h-4 mt-0.5 flex-shrink-0"
              />
              <label className="text-xs sm:text-sm text-dark-grey/70">
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-soft-teal hover:text-dark-grey transition-colors"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-soft-teal hover:text-dark-grey transition-colors"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                size="md"
                disabled={loading}
                className="mt-6 w-48 text-soft-teal hover:text-dark-grey transition-colors"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </div>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-dark-grey/60">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-soft-teal hover:text-dark-grey font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
