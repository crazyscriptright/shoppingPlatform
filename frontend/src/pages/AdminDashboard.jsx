import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Input from "../components/Input";
import api from "../services/api";
import { getDeliveryInfo } from "../utils/orderUtils";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, statsRes] = await Promise.all([
        api.get("/products"),
        api.get("/admin/stats"),
      ]);
      setProducts(productsRes.data.products || []);
      setStats(statsRes.data || stats);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        category: product.category,
        stock: product.stock,
        description: product.description || "",
        image: product.image || "",
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        price: "",
        category: "",
        stock: "",
        description: "",
        image: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      price: "",
      category: "",
      stock: "",
      description: "",
      image: "",
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!formData.name.trim()) {
      alert("Product name is required");
      return;
    }
    if (parseFloat(formData.price) <= 0) {
      alert("Price must be greater than 0");
      return;
    }
    if (!formData.category.trim()) {
      alert("Category is required");
      return;
    }
    if (parseInt(formData.stock) < 0) {
      alert("Stock cannot be negative");
      return;
    }

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, formData);
      } else {
        await api.post("/products", formData);
      }
      fetchDashboardData();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving product:", error);
      alert(error.response?.data?.message || "Failed to save product");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchDashboardData();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-teal"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-dark-grey mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-slate">Manage your store and products</p>
          </div>
          <Button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            Add Product
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-linear-to-br from-soft-teal to-muted-slate text-off-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Package size={32} />
              <TrendingUp size={24} className="text-warm-grey" />
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.totalProducts}</h3>
            <p className="text-warm-grey">Total Products</p>
          </div>

          <div className="bg-linear-to-br from-muted-slate to-dark-grey text-off-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <ShoppingBag size={32} />
              <TrendingUp size={24} className="text-warm-grey" />
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.totalOrders}</h3>
            <p className="text-warm-grey">Total Orders</p>
          </div>

          <div className="bg-linear-to-br from-soft-teal to-dark-grey text-off-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Users size={32} />
              <TrendingUp size={24} className="text-warm-grey" />
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.totalUsers}</h3>
            <p className="text-warm-grey">Total Users</p>
          </div>

          <div className="bg-linear-to-br from-muted-slate to-soft-teal text-off-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign size={32} />
              <TrendingUp size={24} className="text-warm-grey" />
            </div>
            <h3 className="text-3xl font-bold mb-1">
              ₹{stats.totalRevenue?.toFixed(2)}
            </h3>
            <p className="text-warm-grey">Total Revenue</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/admin/products"
            className="bg-warm-grey rounded-lg p-6 hover:shadow-lg transition group"
          >
            <Package
              className="text-soft-teal mb-4 group-hover:scale-110 transition"
              size={32}
            />
            <h3 className="text-xl font-semibold text-dark-grey mb-2">
              Manage Products
            </h3>
            <p className="text-muted-slate">Add, edit, or remove products</p>
          </Link>

          <Link
            to="/admin/orders"
            className="bg-warm-grey rounded-lg p-6 hover:shadow-lg transition group"
          >
            <ShoppingBag
              className="text-soft-teal mb-4 group-hover:scale-110 transition"
              size={32}
            />
            <h3 className="text-xl font-semibold text-dark-grey mb-2">
              Manage Orders
            </h3>
            <p className="text-muted-slate">View and process orders</p>
          </Link>

          <Link
            to="/admin/users"
            className="bg-warm-grey rounded-lg p-6 hover:shadow-lg transition group"
          >
            <Users
              className="text-soft-teal mb-4 group-hover:scale-110 transition"
              size={32}
            />
            <h3 className="text-xl font-semibold text-dark-grey mb-2">
              Manage Users
            </h3>
            <p className="text-muted-slate">View and manage customers</p>
          </Link>
        </div>

        {/* Recent Products */}
        <div className="bg-warm-grey rounded-lg p-6">
          <h2 className="text-2xl font-bold text-dark-grey mb-6">
            Recent Products
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-muted-slate">
                  <th className="text-left py-3 px-4 text-dark-grey font-semibold">
                    Image
                  </th>
                  <th className="text-left py-3 px-4 text-dark-grey font-semibold">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-dark-grey font-semibold">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 text-dark-grey font-semibold">
                    Price
                  </th>
                  <th className="text-left py-3 px-4 text-dark-grey font-semibold">
                    Stock
                  </th>
                  <th className="text-left py-3 px-4 text-dark-grey font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 10).map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-warm-grey hover:bg-off-white transition"
                  >
                    <td className="py-3 px-4">
                      <img
                        src={product.image || "/placeholder-product.jpg"}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="py-3 px-4 text-dark-grey">{product.name}</td>
                    <td className="py-3 px-4 text-muted-slate">
                      {product.category}
                    </td>
                    <td className="py-3 px-4 text-dark-grey font-semibold">
                      ₹{parseFloat(product.price || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          product.stock > 10
                            ? "bg-soft-teal/20 text-soft-teal"
                            : product.stock > 0
                            ? "bg-warm-grey/30 text-dark-grey"
                            : "bg-muted-slate/30 text-muted-slate"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="text-soft-teal hover:text-muted-slate transition"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingProduct ? "Edit Product" : "Add New Product"}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Preview */}
            {formData.image && (
              <div className="flex justify-center">
                <div className="relative">
                  <img
                    src={formData.image || "/placeholder-product.jpg"}
                    alt="Product preview"
                    className="w-32 h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = "/placeholder-product.jpg";
                    }}
                  />
                  <div className="absolute -top-2 -right-2 bg-soft-teal text-off-white text-xs px-2 py-1 rounded-full">
                    Preview
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Product Name *"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                  minLength={3}
                  maxLength={100}
                />
                <p className="text-xs text-muted-slate mt-1">
                  {formData.name.length}/100 characters
                </p>
              </div>

              <div>
                <Input
                  label="Price (₹) *"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  required
                />
              </div>

              <div>
                <Input
                  label="Stock Quantity *"
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  label="Category *"
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g., Electronics, Clothing, Books"
                  required
                  maxLength={50}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-dark-grey font-medium mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg (Leave empty for placeholder)"
                  className="w-full px-4 py-2.5 rounded-lg bg-off-white text-dark-grey placeholder-muted-slate focus:outline-none focus:ring-2 focus:ring-soft-teal transition"
                />
                <p className="text-xs text-muted-slate mt-1">
                  Paste a direct image URL or leave empty to use default
                  placeholder
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-dark-grey font-medium mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter product description (optional)"
                  maxLength={500}
                  className="w-full px-4 py-2.5 rounded-lg bg-off-white text-dark-grey placeholder-muted-slate focus:outline-none focus:ring-2 focus:ring-soft-teal transition resize-none"
                />
                <p className="text-xs text-muted-slate mt-1">
                  {formData.description.length}/500 characters
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-warm-grey">
              <Button type="submit" fullWidth>
                {editingProduct ? "Update Product" : "Add Product"}
              </Button>
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default AdminDashboard;
