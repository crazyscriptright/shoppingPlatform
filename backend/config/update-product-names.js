import pool from "./db.js";

// Update product names to be more shopping-appropriate
const updateProductNames = async () => {
  try {
    console.log("Updating product names...");

    const updates = [
      // Bags
      {
        old: "Elegant Green Luxury Handbag",
        new: "Luxury Green Leather Handbag",
      },
      { old: "Fashion Leather Handbag", new: "Classic Leather Handbag" },
      { old: "Pink Designer Handbag", new: "Designer Pink Handbag" },
      { old: "Classic Leather Handbag", new: "Elegant Black Leather Handbag" },
      {
        old: "Fashion Accessories Handbag Set",
        new: "Premium Handbag with Accessories Set",
      },
      { old: "Woman Leather Fashion Bag", new: "Brown Leather Shoulder Bag" },
      { old: "Women White Glamour Handbag", new: "White Glamour Handbag" },
      { old: "Woman Shopping Bag", new: "Straw Summer Shopping Bag" },

      // Shoes
      { old: "Colorful Sport Shoes - Mustard", new: "Colorful Running Shoes" },
      { old: "Colorful Sport Sneakers", new: "Vibrant Sport Sneakers" },
      {
        old: "Men's Leather Sneakers",
        new: "Premium Leather Casual Sneakers",
      },
      { old: "Fashion Shoes Sneakers", new: "Modern Fashion Sneakers" },
      { old: "Stylish Shoe Trainer", new: "Athletic Training Sneakers" },
      { old: "Concept Male Sneakers", new: "Designer Black Sneakers" },
      { old: "Black Puma Shoes", new: "Black Athletic Running Shoes" },
      {
        old: "Black White Puma Sneakers",
        new: "Black & White Sport Sneakers",
      },
      { old: "Blue Adidas Shoes", new: "Blue Performance Running Shoes" },
      {
        old: "Cement Black Adidas Sneakers",
        new: "Grey & Black Urban Sneakers",
      },
      { old: "Brown Rubber Flip Flops", new: "Comfort Brown Flip Flops" },
      { old: "Men's Leather Sandals", new: "Leather Casual Sandals" },
      { old: "Top View Flip Flops", new: "Classic Beach Flip Flops" },

      // Watches
      {
        old: "Elegant Silver Golden Watch",
        new: "Silver & Gold Chain Watch",
      },
      { old: "Stylish Golden Watch", new: "Luxury Gold Wrist Watch" },
      {
        old: "Realistic Watch Chronograph",
        new: "Classic Chronograph Watch",
      },
      { old: "Close-up Time Clock", new: "Elegant Silver Watch" },
      { old: "Unique Wrist Watch", new: "Modern Designer Watch" },

      // Perfumes
      { old: "Elegant Black Perfume", new: "Noir Elegance Perfume" },
      { old: "Yellow Fragrance Bottle", new: "Golden Citrus Fragrance" },
      { old: "Round Perfume Bottle", new: "Sky Blue Perfume" },
      { old: "3D Realistic Women's Perfume", new: "Rose Pink Perfume" },
      { old: "Vertical Parfum View", new: "Wooden Amber Parfum" },

      // Men's Fashion
      {
        old: "Elegant Young Handsome Man",
        new: "Men's Formal Suit Collection",
      },
      { old: "Confident Stylish Man", new: "Men's Casual Outfit Set" },
      { old: "Handsome Man with Sunglasses", new: "Men's Street Style Set" },
      { old: "Handsome Young Man Sitting", new: "Men's Casual Grey Outfit" },
      { old: "Confident Hipster Style", new: "Men's Hipster Fashion Set" },
      { old: "Young Handsome Hipster Man", new: "Men's Urban Casual Wear" },
      { old: "Black Pants - Small", new: "Classic Black Trousers" },
      { old: "Cement Kurta", new: "Cement Grey Traditional Kurta" },
      { old: "Gold Kurta", new: "Golden Ethnic Kurta" },
      { old: "Grey Pants", new: "Grey Formal Trousers" },
      { old: "Light Vennela Kurta", new: "Light Cream Kurta" },

      // Women's Fashion
      { old: "Gentle Pretty Woman", new: "Women's Winter Coat with Hat" },
      { old: "Face People Makeup Female", new: "Women's Beauty Portrait Set" },
      {
        old: "Young Elegant Blonde Woman",
        new: "Women's Poncho with Dress",
      },
      {
        old: "Smiley Woman in Ukrainian Shirt",
        new: "Traditional Embroidered Shirt",
      },
      {
        old: "Stylish Woman White Jumper",
        new: "White Jumper with Red Tights",
      },
      {
        old: "Young Teen Woman Shopping",
        new: "Women's Summer Shopping Outfit",
      },
      { old: "Navy Blue Shirt", new: "Classic Navy Blue Shirt" },
      { old: "Navy Brown Shirt", new: "Navy Brown Casual Shirt" },
      { old: "Navy Cement Shirt", new: "Navy Cement Casual Top" },
    ];

    for (const update of updates) {
      await pool.query("UPDATE products SET name = $1 WHERE name = $2", [
        update.new,
        update.old,
      ]);
      console.log(`Updated: ${update.old} → ${update.new}`);
    }

    console.log("\n✅ All product names updated successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error updating product names:", error);
    process.exit(1);
  }
};

updateProductNames();
