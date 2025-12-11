import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users as UsersIcon,
  Mail,
  Calendar,
  Shield,
  Search,
} from "lucide-react";
import api from "../../services/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/admin/users");
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-soft-teal/30 text-soft-teal border-soft-teal/40";
      case "customer":
        return "bg-muted-slate/20 text-muted-slate border-muted-slate/30";
      default:
        return "bg-warm-grey/20 text-dark-grey border-warm-grey/30";
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      roleFilter === "all" || user.role?.toLowerCase() === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-teal"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-muted-slate dark:text-off-white/60 mb-2 transition-colors">
            <Link to="/admin" className="hover:text-soft-teal">
              Dashboard
            </Link>
            <span>/</span>
            <span>Users</span>
          </div>
          <h1 className="text-4xl font-bold text-dark-grey dark:text-off-white mb-2 transition-colors">
            Manage Users
          </h1>
          <p className="text-muted-slate dark:text-off-white/70 transition-colors">
            View and manage all registered users
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-warm-grey/20 dark:bg-muted-slate/20 rounded-lg p-5 transition-colors">
            <div className="text-3xl font-bold text-dark-grey dark:text-off-white transition-colors">
              {users.length}
            </div>
            <div className="text-sm text-muted-slate dark:text-off-white/70 mt-1 transition-colors">
              Total Users
            </div>
          </div>
          <div className="bg-warm-grey/20 rounded-lg p-5">
            <div className="text-3xl font-bold text-dark-grey">
              {users.filter((u) => u.role === "admin").length}
            </div>
            <div className="text-sm text-muted-slate mt-1">Admins</div>
          </div>
          <div className="bg-warm-grey/20 rounded-lg p-5">
            <div className="text-3xl font-bold text-dark-grey">
              {users.filter((u) => u.role === "customer").length}
            </div>
            <div className="text-sm text-muted-slate mt-1">Customers</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-warm-grey/20 dark:bg-muted-slate/20 rounded-lg p-5 mb-6 transition-colors">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-slate dark:text-off-white/60 transition-colors"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-off-white dark:bg-dark-grey text-dark-grey dark:text-off-white placeholder-muted-slate dark:placeholder-off-white/50 focus:outline-none focus:ring-2 focus:ring-soft-teal transition-colors"
              />
            </div>

            {/* Role Filter */}
            <div className="flex gap-2">
              {["all", "admin", "customer"].map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    roleFilter === role
                      ? "bg-soft-teal text-off-white"
                      : "bg-off-white dark:bg-dark-grey text-dark-grey dark:text-off-white hover:bg-warm-grey/10 dark:hover:bg-muted-slate/20"
                  }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-off-white dark:bg-dark-grey rounded-lg overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-warm-grey/20 dark:bg-muted-slate/20 transition-colors">
                <tr>
                  <th className="text-left py-4 px-6 text-dark-grey dark:text-off-white font-semibold transition-colors">
                    ID
                  </th>
                  <th className="text-left py-4 px-6 text-dark-grey font-semibold">
                    Name
                  </th>
                  <th className="text-left py-4 px-6 text-dark-grey font-semibold">
                    Email
                  </th>
                  <th className="text-left py-4 px-6 text-dark-grey font-semibold">
                    Role
                  </th>
                  <th className="text-left py-4 px-6 text-dark-grey font-semibold">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-12 text-muted-slate dark:text-off-white/60 transition-colors"
                    >
                      <UsersIcon
                        size={48}
                        className="mx-auto mb-4 opacity-50"
                      />
                      <p>No users found</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-t border-warm-grey dark:border-muted-slate/30 hover:bg-off-white/50 dark:hover:bg-muted-slate/10 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="font-medium text-dark-grey">
                          #{user.id}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-dark-grey">
                          {user.name}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-muted-slate dark:text-off-white/70 transition-colors">
                          <Mail size={14} />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(
                            user.role
                          )}`}
                        >
                          <Shield size={12} />
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1 text-muted-slate dark:text-off-white/70 transition-colors">
                          <Calendar size={14} />
                          <span className="text-sm">
                            {new Date(user.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
