import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Calendar, Lock, Eye, EyeOff } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import api from "../services/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: verify email/dob, 2: reset password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    dob: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/verify-user", {
        email: formData.email,
        dob: formData.dob,
      });

      if (response.data.verified) {
        setStep(2);
      } else {
        setError("Email or Date of Birth does not match our records");
      }
    } catch (error) {
      setError(
        error.response?.data?.error ||
          "Verification failed. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/reset-password", {
        email: formData.email,
        dob: formData.dob,
        newPassword: formData.newPassword,
      });

      if (response.data.success) {
        // Show success message and redirect to login
        navigate("/login", {
          state: { message: "Password reset successful. Please login." },
        });
      }
    } catch (error) {
      setError(
        error.response?.data?.error ||
          "Password reset failed. Please try again."
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
            {step === 1 ? "Forgot Password" : "Reset Password"}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-dark-grey/60 font-light">
            {step === 1
              ? "Enter your email and date of birth to verify your identity"
              : "Create a new password for your account"}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          {step === 1 ? (
            // Step 1: Verify Email and DOB
            <form onSubmit={handleVerify} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
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

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  size="md"
                  disabled={loading}
                  className="mt-6 w-48 border-2 border-soft-teal hover:border-soft-teal/80 text-soft-teal hover:text-dark-grey transition-colors"
                >
                  {loading ? "Verifying..." : "Verify Identity"}
                </Button>
              </div>
            </form>
          ) : (
            // Step 2: Reset Password
            <form onSubmit={handleResetPassword} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* New Password Input */}
              <div className="relative">
                <Lock
                  className="absolute left-3 top-[42px] text-muted-slate pointer-events-none"
                  size={18}
                />
                <Input
                  label="New Password"
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
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
                  label="Confirm New Password"
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
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                size="md"
                disabled={loading}
                className="mt-6 w-48 border-2 border-soft-teal hover:border-soft-teal/80 text-soft-teal hover:text-dark-grey transition-colors"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}

          {/* Back to Login Link */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-soft-teal hover:text-dark-grey transition-colors"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
