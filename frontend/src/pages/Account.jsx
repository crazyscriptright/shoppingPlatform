import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Calendar, Lock, Save, Edit2 } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import api from "../services/api";

const Account = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        dob: user.dob || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ type: "", text: "" });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setMessage({ type: "", text: "" });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await api.put("/auth/profile", formData);
      if (response.data.user) {
        updateUser(response.data.user);
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setIsEditing(false);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "New password must be at least 6 characters",
      });
      setLoading(false);
      return;
    }

    try {
      await api.put("/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setMessage({
        type: "success",
        text: "Password changed successfully!",
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to change password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3EF]">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-3xl md:text-4xl font-normal text-dark-grey mb-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            My Account
          </h1>
          <p className="text-dark-grey/60">Manage your account settings</p>
        </div>

        {/* Success/Error Message */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-soft-teal/10 text-dark-grey border border-soft-teal/30"
                : "bg-muted-slate/20 text-dark-grey border border-muted-slate/30"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Profile Information */}
        <div className="bg-off-white rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-dark-grey">
              Profile Information
            </h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-soft-teal border border-soft-teal rounded hover:bg-soft-teal hover:text-off-white transition"
              >
                <Edit2 size={16} />
                Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-5">
            {/* Name */}
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
                disabled={!isEditing}
                required
                className="pl-10"
              />
            </div>

            {/* Email */}
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
                disabled={!isEditing}
                required
                className="pl-10"
              />
            </div>

            {/* Date of Birth */}
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
                disabled={!isEditing}
                required
                className="pl-10"
              />
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  size="md"
                  disabled={loading}
                  className="border-2 border-soft-teal hover:border-soft-teal/80 text-soft-teal hover:text-dark-grey transition-colors"
                >
                  <Save size={16} className="mr-2" />
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user.name || "",
                      email: user.email || "",
                      dob: user.dob || "",
                    });
                  }}
                  size="md"
                  className="border-2 border-warm-grey/50 hover:border-warm-grey text-dark-grey transition-colors"
                >
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-lg  p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-medium text-dark-grey">
                Password & Security
              </h2>
              <p className="text-sm text-dark-grey/60 mt-1">
                Update your password to keep your account secure
              </p>
            </div>
            {!isChangingPassword && (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-soft-teal border border-soft-teal rounded hover:bg-soft-teal hover:text-off-white transition"
              >
                <Lock size={16} />
                Change Password
              </button>
            )}
          </div>

          {isChangingPassword && (
            <form onSubmit={handleChangePassword} className="space-y-5">
              {/* Current Password */}
              <div className="relative">
                <Lock
                  className="absolute left-3 top-[42px] text-muted-slate pointer-events-none"
                  size={18}
                />
                <Input
                  label="Current Password"
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  required
                  className="pl-10"
                />
              </div>

              {/* New Password */}
              <div className="relative">
                <Lock
                  className="absolute left-3 top-[42px] text-muted-slate pointer-events-none"
                  size={18}
                />
                <Input
                  label="New Password"
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  required
                  className="pl-10"
                />
              </div>

              {/* Confirm New Password */}
              <div className="relative">
                <Lock
                  className="absolute left-3 top-[42px] text-muted-slate pointer-events-none"
                  size={18}
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  required
                  className="pl-10"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  size="md"
                  disabled={loading}
                  className="border-2 border-soft-teal hover:border-soft-teal/80 text-soft-teal hover:text-dark-grey transition-colors"
                >
                  <Save size={16} className="mr-2" />
                  {loading ? "Updating..." : "Update Password"}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  size="md"
                  className="border-2 border-warm-grey/50 hover:border-warm-grey text-dark-grey transition-colors"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Account Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-lg  p-6 text-center">
            <div className="text-3xl font-medium text-soft-teal mb-2">0</div>
            <div className="text-sm text-dark-grey/60">Total Orders</div>
          </div>
          <div className="bg-white rounded-lg  p-6 text-center">
            <div className="text-3xl font-medium text-soft-teal mb-2">₹0</div>
            <div className="text-sm text-dark-grey/60">Total Spent</div>
          </div>
          <div className="bg-white rounded-lg  p-6 text-center">
            <div className="text-3xl font-medium text-soft-teal mb-2">0</div>
            <div className="text-sm text-dark-grey/60">Wishlist Items</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
