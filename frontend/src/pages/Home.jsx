import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp } from "lucide-react";
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";
import FeatureCard from "../components/FeatureCard";
import SectionHeader from "../components/SectionHeader";
import LoadingSpinner from "../components/LoadingSpinner";
import Button from "../components/Button";
import api from "../services/api";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Category cards data
  const categoryCards = [
    {
      image:
        "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=400&auto=format&fit=crop",
      title: "Classic Hat",
      showArrow: false,
    },
    {
      image:
        "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&auto=format&fit=crop",
      title: "Mini Wallet",
      showArrow: false,
    },
    {
      image:
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&auto=format&fit=crop",
      title: "Belt Bag",
      showArrow: false,
    },
    {
      image:
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&auto=format&fit=crop",
      title: "Shoes",
      showArrow: true,
    },
  ];

  // Feature cards data
  const features = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 lg:h-8 lg:w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
      ),
      title: "Free Shipping",
      description: "On orders over ₹50",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 lg:h-8 lg:w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      ),
      title: "Easy Returns",
      description: "30-day return policy",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 lg:h-8 lg:w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      title: "Secure Payment",
      description: "100% secure transactions",
    },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const [featured, newItems] = await Promise.all([
        api.get("/products?featured=true&limit=4"),
        api.get("/products?new=true&limit=4"),
      ]);
      setFeaturedProducts(featured.data.products || []);
      setNewArrivals(newItems.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3EF]">
      {/* Hero Section */}
      <section className="relative bg-[#F5F3EF]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="hero-grid py-8 lg:py-16">
            {/* Left side - Text */}
            <div className="hero-text-container space-y-6 lg:space-y-8">
              <div className="space-y-1">
                <div className="text-xs tracking-widest text-dark-grey/60">
                  D'Florencis
                </div>
                <div className="text-xs tracking-wide text-dark-grey/50">
                  Hype AAEs
                </div>
              </div>

              <h1
                className="text-6xl lg:text-7xl xl:text-8xl leading-[1] tracking-tight text-dark-grey pr-4"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  marginBottom: "0.5rem",
                }}
              >
                Bring
                <br />
                The Hype
              </h1>

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Link to="/login" className="group">
                  <div className="relative overflow-hidden bg-soft-teal text-off-white px-8 py-3 rounded-full font-medium text-sm tracking-wide transition-all duration-300 hover:bg-dark-grey hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                    <span>Sign Up</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </Link>
                <Link to="/shop" className="group">
                  <div className="relative overflow-hidden bg-transparent border border-dark-grey text-dark-grey px-8 py-3 rounded-full font-medium text-sm tracking-wide transition-all duration-300 hover:bg-dark-grey hover:text-off-white hover:scale-105 flex items-center justify-center gap-2">
                    <span>Explore</span>
                    <TrendingUp className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                </Link>
              </div>
            </div>

            {/* Right side - Hero Image (fixed in background on desktop) */}
            <div className="hero-image-wrapper">
              <img
                src="/hero.webp"
                alt="Fashion Model"
                className="w-full h-auto"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section with Product Cards */}
      <section className="bg-white py-24 lg:py-32" style={{ padding: 24 }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-6 items-center">
            {/* New Arrival Text */}
            <div className="lg:col-span-1">
              <h2
                className="text-5xl lg:text-6xl leading-tight text-dark-grey"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                New
                <br />
                Arival
              </h2>
            </div>

            {/* Product Cards */}
            <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {categoryCards.map((card, index) => (
                <CategoryCard
                  key={index}
                  image={card.image}
                  title={card.title}
                  showArrow={card.showArrow}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 lg:py-16 bg-[#F5F3EF]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <SectionHeader
            title="Featured Products"
            subtitle="Handpicked favorites just for you"
            action={
              <Link to="/shop?featured=true">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            }
          />

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Special Offer Banner */}
      {/* <section className="py-12 lg:py-16 bg-soft-teal">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-off-white mb-3 lg:mb-4 leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            35% off only this Friday
          </h2>
          <p className="text-off-white/80 text-base sm:text-lg lg:text-xl mb-6 lg:mb-8 font-light">
            and get special gift
          </p>
          <Link to="/shop?sale=true">
            <Button
              size="md"
              className="bg-off-white text-dark-grey hover:bg-opacity-90"
            >
              Shop Sale
            </Button>
          </Link>
        </div>
      </section> */}

      {/* Features Section */}
      <section className="py-12 lg:py-16 bg-off-white" style={{ padding: 24 }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 text-center">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
