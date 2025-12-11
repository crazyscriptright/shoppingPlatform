import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, Edit, Trash2, Plus, Search } from "lucide-react";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import Input from "../../components/Input";
import api from "../../services/api";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
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
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
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
      fetchProducts();
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
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  };

  const categories = [
    "all",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
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
            <span>Products</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-dark-grey dark:text-off-white mb-2 transition-colors">
                Manage Products
              </h1>
              <p className="text-muted-slate dark:text-off-white/70 transition-colors">
                Add, edit, or remove products from your store
              </p>
            </div>
            <Button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2"
            >
              <Plus size={20} />
              Add Product
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-warm-grey/20 dark:bg-muted-slate/20 rounded-lg p-5 transition-colors">
            <div className="text-3xl font-bold text-dark-grey dark:text-off-white transition-colors">
              {products.length}
            </div>
            <div className="text-sm text-muted-slate dark:text-off-white/70 mt-1 transition-colors">
              Total Products
            </div>
          </div>
          <div className="bg-warm-grey/20 rounded-lg p-5">
            <div className="text-3xl font-bold text-dark-grey">
              {products.filter((p) => p.stock > 10).length}
            </div>
            <div className="text-sm text-muted-slate mt-1">In Stock</div>
          </div>
          <div className="bg-warm-grey/20 rounded-lg p-5">
            <div className="text-3xl font-bold text-dark-grey">
              {products.filter((p) => p.stock > 0 && p.stock <= 10).length}
            </div>
            <div className="text-sm text-muted-slate mt-1">Low Stock</div>
          </div>
          <div className="bg-warm-grey/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-dark-grey">
              {products.filter((p) => p.stack === 0).length}
            </div>
            <div className="text-sm text-muted-slate">Out of Stock</div>
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
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-off-white dark:bg-dark-grey text-dark-grey dark:text-off-white placeholder-muted-slate dark:placeholder-off-white/50 focus:outline-none focus:ring-2 focus:ring-soft-teal transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    categoryFilter === category
                      ? "bg-soft-teal text-off-white"
                      : "bg-off-white dark:bg-dark-grey text-dark-grey dark:text-off-white hover:bg-warm-grey/10 dark:hover:bg-muted-slate/20"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-off-white dark:bg-dark-grey rounded-lg overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-warm-grey/20 dark:bg-muted-slate/20 transition-colors">
                <tr>
                  <th className="text-left py-4 px-6 text-dark-grey dark:text-off-white font-semibold transition-colors">
                    Image
                  </th>
                  <th className="text-left py-4 px-6 text-dark-grey font-semibold">
                    Name
                  </th>
                  <th className="text-left py-4 px-6 text-dark-grey font-semibold">
                    Category
                  </th>
                  <th className="text-left py-4 px-6 text-dark-grey font-semibold">
                    Price
                  </th>
                  <th className="text-left py-4 px-6 text-dark-grey font-semibold">
                    Stock
                  </th>
                  <th className="text-left py-4 px-6 text-dark-grey font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-12 text-muted-slate dark:text-off-white/60 transition-colors"
                    >
                      <Package size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No products found</p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-t border-warm-grey dark:border-muted-slate/30 hover:bg-off-white/50 dark:hover:bg-muted-slate/10 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <img
                          src={product.image || "/placeholder-product.jpg"}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-dark-grey dark:text-off-white transition-colors">
                          {product.name}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-muted-slate dark:text-off-white/70 transition-colors">
                        {product.category}
                      </td>
                      <td className="py-4 px-6 text-dark-grey dark:text-off-white font-semibold transition-colors">
                        ₹{parseFloat(product.price || 0).toFixed(2)}
                      </td>
                      <td className="py-4 px-6">
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
                      <td className="py-4 px-6">
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
                  ))
                )}
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
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Image Preview */}
            {formData.image && (
              <div className="flex justify-center mb-2">
                <div className="relative p-2 bg-warm-grey/10 rounded-xl">
                  <img
                    src={formData.image || "/placeholder-product.jpg"}
                    alt="Product preview"
                    className="w-40 h-40 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = "/placeholder-product.jpg";
                    }}
                  />
                  <div className="absolute -top-1 -right-1 bg-soft-teal text-off-white text-xs font-medium px-3 py-1 rounded-full">
                    Preview
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

            <div className="flex gap-3 pt-6 mt-2 border-t border-warm-grey/30">
              <Button type="submit" fullWidth className="py-3">
                {editingProduct ? "Update Product" : "Add Product"}
              </Button>
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={handleCloseModal}
                className="py-3"
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

export default AdminProducts;
