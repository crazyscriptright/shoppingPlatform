import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { Filter, Grid, List } from "lucide-react";
import ProductCard from "../components/ProductCard";
import Button from "../components/Button";
import api from "../services/api";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    minPrice: "",
    maxPrice: "",
    sort: searchParams.get("sort") || "newest",
  });
  const [priceInputs, setPriceInputs] = useState({
    minPrice: "",
    maxPrice: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const observer = useRef();
  const priceDebounceTimer = useRef(null);
  const lastProductRef = useCallback(
    (node) => {
      if (loadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadingMore, hasMore]
  );

  const categories = [
    "All",
    "Bags",
    "Shoes",
    "Watches",
    "Perfumes",
    "Men",
    "Women",
  ];
  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "popular", label: "Most Popular" },
  ];

  const clearFilters = useCallback(() => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      sort: "newest",
    });
    setPriceInputs({
      minPrice: "",
      maxPrice: "",
    });
    setSearchParams({});
    setPage(1);
    setHasMore(true);
  }, [setSearchParams]);

  useEffect(() => {
    if (location.state?.resetFilters) {
      clearFilters();
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, clearFilters, navigate]);

  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    fetchProducts(1, true);
    // Scroll to top when filters change
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [filters]);

  useEffect(() => {
    if (page > 1) {
      fetchProducts(page, false);
    }
  }, [page]);

  const fetchProducts = async (pageNum, reset = false) => {
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    try {
      const params = new URLSearchParams();
      if (filters.category && filters.category !== "All") {
        params.append("category", filters.category);
      }
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
      if (filters.sort) params.append("sort", filters.sort);
      params.append("limit", "12");
      params.append("offset", (pageNum - 1) * 12);

      const response = await api.get(`/products?${params.toString()}`);
      const newProducts = response.data.products || [];

      if (reset) {
        setProducts(newProducts);
      } else {
        setProducts((prev) => [...prev, ...newProducts]);
      }

      setHasMore(newProducts.length === 12);
    } catch (error) {
      console.error("Error fetching products:", error);
      if (reset) {
        setProducts([]);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleFilterChange = (key, value) => {
    // For price filters, debounce the search
    if (key === "minPrice" || key === "maxPrice") {
      // Update input state immediately for UI
      setPriceInputs((prev) => ({ ...prev, [key]: value }));

      // Clear existing timer
      if (priceDebounceTimer.current) {
        clearTimeout(priceDebounceTimer.current);
      }

      // Set new timer to apply filter after 1500ms
      priceDebounceTimer.current = setTimeout(() => {
        setFilters((prev) => ({ ...prev, [key]: value }));
      }, 1500);
    } else {
      // For other filters (category, sort), apply immediately
      setFilters((prev) => ({ ...prev, [key]: value }));
      if (key === "category" || key === "sort") {
        const newParams = new URLSearchParams(searchParams);
        if (value && value !== "All") {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
        setSearchParams(newParams);
      }
    }
  };

  const handleExternalReset = useCallback(() => {
    clearFilters();
  }, [clearFilters]);

  useEffect(() => {
    window.addEventListener("shop:resetFilters", handleExternalReset);
    return () => {
      window.removeEventListener("shop:resetFilters", handleExternalReset);
    };
  }, [handleExternalReset]);

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dark-grey mb-2">Shop</h1>
          <p className="text-muted-slate">Discover our complete collection</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div
            className={`lg:w-64 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <div className="bg-warm-grey rounded-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-dark-grey flex items-center gap-2">
                  <Filter size={20} />
                  Filters
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-soft-teal text-sm hover:underline"
                >
                  Clear All
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-dark-grey mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={
                          filters.category === category ||
                          (category === "All" && !filters.category)
                        }
                        onChange={() =>
                          handleFilterChange(
                            "category",
                            category === "All" ? "" : category
                          )
                        }
                        className="mr-2 accent-soft-teal"
                      />
                      <span className="text-dark-grey">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold text-dark-grey mb-3">
                  Price Range
                </h4>
                <div className="space-y-3">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={priceInputs.minPrice}
                    onChange={(e) =>
                      handleFilterChange("minPrice", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded border border-muted-slate focus:border-soft-teal focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={priceInputs.maxPrice}
                    onChange={(e) =>
                      handleFilterChange("maxPrice", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded border border-muted-slate focus:border-soft-teal focus:outline-none"
                  />
                </div>
              </div>

              <Button onClick={fetchProducts} fullWidth>
                Apply Filters
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-warm-grey rounded-lg p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 text-dark-grey hover:text-soft-teal"
                >
                  <Filter size={20} />
                  Filters
                </button>
                <span className="text-dark-grey">
                  {products.length} Products
                </span>
              </div>

              <div className="flex items-center gap-4  w-full sm:w-auto">
                {/* Sort Dropdown */}
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                  className="px-3 py-2.5 rounded bg-off-white text-dark-grey focus:outline-none focus:ring-2 focus:ring-soft-teal text-sm sm:w-auto min-w-160px"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* View Toggle */}
                <div className="flex gap-2 sm:ml-8">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${
                      viewMode === "grid"
                        ? "bg-soft-teal text-off-white"
                        : "bg-off-white text-dark-grey"
                    }`}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded ${
                      viewMode === "list"
                        ? "bg-soft-teal text-off-white"
                        : "bg-off-white text-dark-grey"
                    }`}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Display */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-teal"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-slate text-lg">No products found</p>
                <Button onClick={clearFilters} className="mt-4">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {products.map((product, index) => {
                    if (products.length === index + 1) {
                      return (
                        <div ref={lastProductRef} key={product.id}>
                          <ProductCard product={product} />
                        </div>
                      );
                    } else {
                      return <ProductCard key={product.id} product={product} />;
                    }
                  })}
                </div>

                {/* Loading More Indicator */}
                {loadingMore && (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-soft-teal"></div>
                  </div>
                )}

                {/* End of Products Message */}
                {!hasMore && products.length > 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-slate text-sm">
                      You've reached the end of the products
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
