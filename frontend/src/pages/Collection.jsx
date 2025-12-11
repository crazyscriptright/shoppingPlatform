import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const CollectionCard = ({ to, imageSrc, title, subtitle }) => (
  <Link
    to={to}
    className="group relative overflow-hidden rounded-lg hover:shadow-lg transition-shadow duration-300"
  >
    <div className="`aspect-4/5` relative">
      <img
        src={imageSrc}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-dark-grey/50 backdrop-blur-sm group-hover:backdrop-blur-none group-hover:bg-dark-grey/30 transition-all duration-300">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="bg-white/35 backdrop-blur-md rounded-xl px-6 py-4 inline-block">
              <h3
                className="text-3xl font-normal text-dark-grey mb-2"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                {title}
              </h3>
              <p className="text-muted-slate text-sm">{subtitle}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Link>
);

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

  const collectionsData = [
    {
      to: "/shop?category=women",
      imageSrc:
        "/collection/indian-beautiful-business-woman-with-long-hair_862994-224889.avif",
      title: "Women's Collection",
      subtitle: "Elegant & Timeless",
    },
    {
      to: "/shop?category=men",
      imageSrc:
        "/collection/man-walks-closet-with-jacket-left-side_545377-12536.avif",
      title: "Men's Collection",
      subtitle: "Sophisticated Style",
    },
    {
      to: "/shop?category=bags",
      imageSrc:
        "/collection/mountain-woman-nature-landscape_1293314-12354.avif",
      title: "Bags Collection",
      subtitle: "Luxury Accessories",
    },
    {
      to: "/shop?category=shoes",
      imageSrc:
        "/collection/indian-beautiful-business-woman-with-long-hair_862994-224889.avif",
      title: "Shoes Collection",
      subtitle: "Step in Style",
    },
    {
      to: "/shop?category=watches",
      imageSrc:
        "/collection/man-walks-closet-with-jacket-left-side_545377-12536.avif",
      title: "Watches Collection",
      subtitle: "Timeless Elegance",
    },
    {
      to: "/shop?category=perfumes",
      imageSrc:
        "/collection/mountain-woman-nature-landscape_1293314-12354.avif",
      title: "Perfumes Collection",
      subtitle: "Signature Scents",
    },
  ];

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
      <div className="bg-off-white border-b border-warm-grey/30">
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
          {collectionsData.map((collection, index) => (
            <CollectionCard
              key={index}
              to={collection.to}
              imageSrc={collection.imageSrc}
              title={collection.title}
              subtitle={collection.subtitle}
            />
          ))}
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
