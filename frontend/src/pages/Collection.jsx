import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Collection = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await api.get("/collections");
      setCollections(response.data.collections || []);
    } catch (error) {
      console.error("Error fetching collections:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center">
        <div className="text-dark-grey">Loading collections...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3EF]">
      {/* Hero Section */}
      <div className="bg-off-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 text-center">
          <h1
            className="text-4xl md:text-5xl font-normal text-dark-grey mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Our Collections
          </h1>
          <p className="text-dark-grey/70 max-w-2xl mx-auto">
            Explore our curated collections of premium products
          </p>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Featured Collections */}
          <Link
            to="/shop?category=women"
            className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="aspect-[4/5] bg-gradient-to-br from-soft-teal/20 to-warm-beige/30">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h3
                    className="text-3xl font-normal text-dark-grey mb-2"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Women's Collection
                  </h3>
                  <p className="text-dark-grey/70 text-sm">
                    Elegant & Timeless
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link
            to="/shop?category=men"
            className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="aspect-[4/5] bg-gradient-to-br from-muted-slate/20 to-warm-beige/30">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h3
                    className="text-3xl font-normal text-dark-grey mb-2"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Men's Collection
                  </h3>
                  <p className="text-dark-grey/70 text-sm">
                    Sophisticated Style
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link
            to="/shop?category=bags"
            className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="aspect-[4/5] bg-gradient-to-br from-warm-beige/30 to-soft-teal/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h3
                    className="text-3xl font-normal text-dark-grey mb-2"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Bags Collection
                  </h3>
                  <p className="text-dark-grey/70 text-sm">
                    Luxury Accessories
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link
            to="/shop?category=shoes"
            className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="aspect-[4/5] bg-gradient-to-br from-muted-slate/30 to-soft-teal/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h3
                    className="text-3xl font-normal text-dark-grey mb-2"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Shoes Collection
                  </h3>
                  <p className="text-dark-grey/70 text-sm">Step in Style</p>
                </div>
              </div>
            </div>
          </Link>

          <Link
            to="/shop?category=watches"
            className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="aspect-[4/5] bg-gradient-to-br from-soft-teal/30 to-muted-slate/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h3
                    className="text-3xl font-normal text-dark-grey mb-2"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Watches Collection
                  </h3>
                  <p className="text-dark-grey/70 text-sm">Timeless Elegance</p>
                </div>
              </div>
            </div>
          </Link>

          <Link
            to="/shop?category=perfumes"
            className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="aspect-[4/5] bg-gradient-to-br from-warm-beige/40 to-soft-teal/30">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h3
                    className="text-3xl font-normal text-dark-grey mb-2"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Perfumes Collection
                  </h3>
                  <p className="text-dark-grey/70 text-sm">Signature Scents</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Link
            to="/shop"
            className="inline-block px-8 py-3 bg-soft-teal text-off-white rounded hover:bg-soft-teal/90 transition"
          >
            View All Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Collection;
