import pool from "./db.js";
import bcrypt from "bcryptjs";

const initDb = async () => {
  try {
    console.log("Initializing database...");

    // Create Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        dob DATE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Users table created");

    // Create Products table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        original_price DECIMAL(10, 2),
        category VARCHAR(100),
        stock INTEGER DEFAULT 0,
        image VARCHAR(500),
        images TEXT[],
        rating DECIMAL(2, 1),
        reviews INTEGER DEFAULT 0,
        discount INTEGER,
        is_new BOOLEAN DEFAULT false,
        is_featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Products table created");

    // Create Orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        shipping_address TEXT NOT NULL,
        payment_method VARCHAR(50),
        payment_id VARCHAR(255),
        payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
        delivery_date TIMESTAMP,
        delivery_phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Orders table created");

    // Add columns if they don't exist (for existing databases)
    await pool.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name='orders' AND column_name='delivery_date') THEN
          ALTER TABLE orders ADD COLUMN delivery_date TIMESTAMP;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name='orders' AND column_name='delivery_phone') THEN
          ALTER TABLE orders ADD COLUMN delivery_phone VARCHAR(20);
        END IF;
      END $$;
    `);
    console.log("Orders table columns verified");

    // Create Order Items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Order Items table created");

    // Drop existing cart_items table if it exists (to recreate with proper constraints)
    await pool.query(`DROP TABLE IF EXISTS cart_items CASCADE`);

    // Create Cart table with proper constraints
    await pool.query(`
      CREATE TABLE cart_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_user_product UNIQUE(user_id, product_id)
      )
    `);
    console.log("Cart Items table created with UNIQUE constraint");

    // Create admin user
    const hashedPassword = await bcrypt.hash("1234567890", 10);
    await pool.query(
      `INSERT INTO users (name, email, password, role) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (email) DO NOTHING`,
      ["Admin User", "anil@gmail.com", hashedPassword, "admin"]
    );
    console.log("Admin user created");

    // Create sample customer
    const customerPassword = await bcrypt.hash("1234567890", 10);
    await pool.query(
      `INSERT INTO users (name, email, password, role) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (email) DO NOTHING`,
      ["John Doe", "user@gmail.com", customerPassword, "customer"]
    );
    console.log("Sample customer created");

    // Create sample products with actual images - ALL 50+ products
    const sampleProducts = [
      // Bags & Handbags (8 products)
      {
        name: "Elegant Green Luxury Handbag",
        description:
          "Beautiful elegance luxury fashion green handbag with premium leather finish. Perfect for formal occasions and everyday elegance.",
        price: 159.99,
        original_price: 199.99,
        category: "Bags",
        stock: 12,
        image:
          "/formated/beautiful-elegance-luxury-fashion-green-handbag_1203-7655.avif",
        rating: 4.8,
        reviews: 34,
        discount: 20,
        is_featured: true,
      },
      {
        name: "Fashion Leather Handbag",
        description:
          "Premium fashion leather handbag with elegant case handle. Spacious interior with multiple compartments.",
        price: 139.99,
        original_price: 179.99,
        category: "Bags",
        stock: 18,
        image: "/formated/fashion-leather-handbag-case-handle_1203-6494.avif",
        rating: 4.7,
        reviews: 28,
        discount: 22,
        is_featured: true,
      },
      {
        name: "Pink Designer Handbag",
        description:
          "Stylish pink handbag with modern design. Perfect blend of fashion and functionality.",
        price: 129.99,
        category: "Bags",
        stock: 15,
        image: "/formated/pink-handbags_1203-7829.avif",
        rating: 4.6,
        reviews: 22,
        is_new: true,
      },
      {
        name: "Classic Leather Handbag",
        description:
          "Timeless leather handbag with elegant design. Suitable for both professional and casual settings.",
        price: 149.99,
        original_price: 189.99,
        category: "Bags",
        stock: 10,
        image: "/formated/handbag_1203-8313.avif",
        rating: 4.9,
        reviews: 41,
        discount: 21,
        is_featured: true,
      },
      {
        name: "Fashion Accessories Handbag Set",
        description:
          "Complete handbag layout with matching accessories. Women's jewellery background collection.",
        price: 199.99,
        original_price: 249.99,
        category: "Bags",
        stock: 8,
        image:
          "/formated/hand-bag-layout-with-place-text-women-s-accessories-jewellery-background-mockup-banner-fashion-accessories_460848-13215.avif",
        rating: 4.8,
        reviews: 19,
        discount: 20,
        is_featured: true,
      },
      {
        name: "Woman Leather Fashion Bag",
        description:
          "Elegant woman leather fashion bag with classic design. Versatile and timeless accessory.",
        price: 169.99,
        original_price: 219.99,
        category: "Bags",
        stock: 14,
        image: "/formated/woman-leather-fashion-bag_1339-102905.avif",
        rating: 4.7,
        reviews: 30,
        discount: 23,
        is_new: true,
      },
      {
        name: "Women White Glamour Handbag",
        description:
          "Glamorous white fashion handbag perfect for elegant occasions. Modern sophisticated style.",
        price: 189.99,
        category: "Bags",
        stock: 11,
        image:
          "/formated/women-white-glamour-background-fashion_1203-6545.avif",
        rating: 4.8,
        reviews: 27,
        is_featured: true,
      },
      {
        name: "Woman Shopping Bag",
        description:
          "Woman in midi dress with straw hat posing with stylish bag. Perfect summer accessory.",
        price: 119.99,
        original_price: 149.99,
        category: "Bags",
        stock: 16,
        image:
          "/formated/woman-midi-dress-straw-hat-posing-with-bag-orange-background_197531-17926.avif",
        rating: 4.5,
        reviews: 23,
        discount: 20,
      },

      // Shoes & Sneakers (13 products)
      {
        name: "Colorful Sport Shoes - Mustard",
        description:
          "Vibrant colorful sport shoes on mustard color background. Perfect for active lifestyle and casual wear.",
        price: 89.99,
        original_price: 119.99,
        category: "Shoes",
        stock: 25,
        image:
          "/formated/colorful-sport-shoes-mustard-color-backround_151013-4389.avif",
        rating: 4.5,
        reviews: 36,
        discount: 25,
        is_new: true,
      },
      {
        name: "Colorful Sport Sneakers",
        description:
          "Modern colorful sport shoes against mustard color wall. Comfortable and stylish design.",
        price: 84.99,
        category: "Shoes",
        stock: 30,
        image:
          "/formated/colorful-sport-shoes-mustard-color-wall_151013-4913.avif",
        rating: 4.4,
        reviews: 28,
        is_new: true,
      },
      {
        name: "Men's Leather Sneakers",
        description:
          "Premium men's leather sneakers with brown laces in dark yellow and light beige style.",
        price: 99.99,
        original_price: 129.99,
        category: "Shoes",
        stock: 20,
        image:
          "/formated/men39s-leather-sneakers-with-brown-laces-dark-yellow-light-beige-style_899449-214389.avif",
        rating: 4.7,
        reviews: 32,
        discount: 23,
        is_featured: true,
      },
      {
        name: "Fashion Shoes Sneakers",
        description:
          "Trendy fashion shoes sneakers with modern design. Perfect for everyday wear.",
        price: 79.99,
        category: "Shoes",
        stock: 28,
        image: "/formated/fashion-shoes-sneakers_1203-7529.avif",
        rating: 4.3,
        reviews: 24,
      },
      {
        name: "Stylish Shoe Trainer",
        description:
          "Modern stylish shoe sneaker trainer isolated design. Lightweight and comfortable.",
        price: 94.99,
        original_price: 119.99,
        category: "Shoes",
        stock: 22,
        image:
          "/formated/stylish-shoe-sneaker-trainer-isolated-white_461160-10622.avif",
        rating: 4.6,
        reviews: 30,
        discount: 21,
        is_new: true,
      },
      {
        name: "Concept Male Sneakers",
        description:
          "Designer concept shoes male sneakers on dark background. Premium quality materials.",
        price: 109.99,
        original_price: 139.99,
        category: "Shoes",
        stock: 15,
        image:
          "/formated/concept-shoes-male-sneakers-dark-background_185193-105021.avif",
        rating: 4.8,
        reviews: 26,
        discount: 22,
        is_featured: true,
      },
      {
        name: "Black Puma Shoes",
        description:
          "Classic black Puma shoes with modern athletic design. Perfect for sports and casual wear.",
        price: 95.99,
        category: "Shoes",
        stock: 24,
        image: "/formated/blackPumaShoes.webp",
        rating: 4.6,
        reviews: 31,
        is_new: true,
      },
      {
        name: "Black White Puma Sneakers",
        description:
          "Stylish black and white Puma sneakers. Classic colorway with modern comfort.",
        price: 99.99,
        category: "Shoes",
        stock: 20,
        image: "/formated/blackwhitePumaShoes.webp",
        rating: 4.7,
        reviews: 29,
      },
      {
        name: "Blue Adidas Shoes",
        description:
          "Vibrant blue Adidas athletic shoes. Perfect for running and training.",
        price: 109.99,
        original_price: 139.99,
        category: "Shoes",
        stock: 18,
        image: "/formated/blueAdidasShoes.webp",
        rating: 4.8,
        reviews: 34,
        discount: 22,
        is_featured: true,
      },
      {
        name: "Cement Black Adidas Sneakers",
        description:
          "Modern cement and black Adidas sneakers. Urban style with premium comfort.",
        price: 119.99,
        category: "Shoes",
        stock: 16,
        image: "/formated/cementblackAdidasShoes.webp",
        rating: 4.6,
        reviews: 26,
      },
      {
        name: "Brown Rubber Flip Flops",
        description:
          "Comfortable brown rubber flip-flops on white background. Perfect for summer and beach.",
        price: 24.99,
        category: "Shoes",
        stock: 40,
        image:
          "/formated/brown-rubber-flip-flops-white-background_33900-4875.jpg",
        rating: 4.2,
        reviews: 45,
      },
      {
        name: "Men's Leather Sandals",
        description:
          "Premium men's and women's fashion leather sandals. Comfortable and durable design.",
        price: 54.99,
        category: "Shoes",
        stock: 32,
        image: "/formated/men-s-women-s-fashion-leather-sandals_1339-9818.jpg",
        rating: 4.4,
        reviews: 38,
      },
      {
        name: "Top View Flip Flops",
        description:
          "Stylish flip-flops with copy space. Minimalist summer footwear.",
        price: 29.99,
        category: "Shoes",
        stock: 35,
        image: "/formated/top-view-flip-flops-copy-space_23-2148922370.avif",
        rating: 4.3,
        reviews: 28,
      },

      // Watches & Timepieces (5 products)
      {
        name: "Elegant Silver Golden Watch",
        description:
          "Elegant watch with silver golden chain isolated. Perfect blend of luxury and style.",
        price: 299.99,
        original_price: 399.99,
        category: "Watches",
        stock: 10,
        image:
          "/formated/elegant-watch-with-silver-golden-chain-isolated_181624-27080.avif",
        rating: 4.9,
        reviews: 45,
        discount: 25,
        is_featured: true,
      },
      {
        name: "Stylish Golden Watch",
        description:
          "Premium stylish golden watch on white surface. Luxury timepiece with exquisite craftsmanship.",
        price: 349.99,
        original_price: 449.99,
        category: "Watches",
        stock: 8,
        image: "/formated/stylish-golden-watch-white-surface_181624-27078.avif",
        rating: 4.8,
        reviews: 38,
        discount: 22,
        is_featured: true,
      },
      {
        name: "Realistic Watch Chronograph",
        description:
          "Realistic watch clock chronograph with silver dark blue face and brown leather strap. Classic luxury design.",
        price: 279.99,
        category: "Watches",
        stock: 12,
        image:
          "/formated/realistic-watch-clock-chronograph-silver-dark-blue-face-brown-leather-strap-white-classic-luxury_33869-4266.avif",
        rating: 4.7,
        reviews: 31,
        is_new: true,
      },
      {
        name: "Close-up Time Clock",
        description:
          "Detailed close-up clock with precise time display. Perfect for professionals.",
        price: 189.99,
        original_price: 239.99,
        category: "Watches",
        stock: 15,
        image: "/formated/close-up-clock-with-time-change_23-2149241141.avif",
        rating: 4.5,
        reviews: 27,
        discount: 21,
      },
      {
        name: "Unique Wrist Watch",
        description:
          "Unique wrist watch generated by AI. Modern futuristic design with premium materials.",
        price: 259.99,
        original_price: 329.99,
        category: "Watches",
        stock: 9,
        image:
          "/formated/unique-wrist-watch-generated-by-ai_1059430-76733.avif",
        rating: 4.7,
        reviews: 22,
        discount: 21,
        is_new: true,
      },

      // Perfumes & Fragrances (5 products)
      {
        name: "Elegant Black Perfume",
        description:
          "Elegant black perfume bottle with sophisticated fragrance. Premium luxury scent.",
        price: 129.99,
        original_price: 159.99,
        category: "Perfumes",
        stock: 20,
        image: "/formated/elegant-black-perfume-bottle_191095-83842.avif",
        rating: 4.8,
        reviews: 52,
        discount: 19,
        is_featured: true,
      },
      {
        name: "Yellow Fragrance Bottle",
        description:
          "Front view yellow fragrance bottle with golden cap on white wall. Fresh and elegant scent.",
        price: 119.99,
        category: "Perfumes",
        stock: 25,
        image:
          "/formated/front-view-yellow-fragrance-bottle-with-golden-cap-white-wall_140725-11697.avif",
        rating: 4.6,
        reviews: 44,
        is_new: true,
      },
      {
        name: "Round Perfume Bottle",
        description:
          "Round perfume bottle logo mockup with blue cloudy sky background. Perfect for branding.",
        price: 139.99,
        original_price: 169.99,
        category: "Perfumes",
        stock: 18,
        image:
          "/formated/round-perfume-bottle-logo-mockup-blue-cloudy-sky-background-branding-3d-render_360590-389.avif",
        rating: 4.7,
        reviews: 39,
        discount: 18,
        is_featured: true,
      },
      {
        name: "3D Realistic Women's Perfume",
        description:
          "Vector 3D realistic perfume bottle for women. Shiny glass container with pink liquid.",
        price: 149.99,
        category: "Perfumes",
        stock: 22,
        image:
          "/formated/vector-3d-realistic-perfume-bottle-women-shiny-glass-container-with-pink-liquid_33099-1226.avif",
        rating: 4.7,
        reviews: 35,
        is_new: true,
      },
      {
        name: "Vertical Parfum View",
        description:
          "Vertical view parfum on wooden cutting boards. Artistic presentation with dark background.",
        price: 134.99,
        original_price: 169.99,
        category: "Perfumes",
        stock: 19,
        image:
          "/formated/vertical-view-parfum-two-wooden-cutting-boards-stacked-top-each-other-dark-color-background-with-free-space_461922-10654.avif",
        rating: 4.6,
        reviews: 28,
        discount: 21,
      },

      // Men's Fashion (11 products)
      {
        name: "Elegant Young Handsome Man",
        description:
          "Premium men's fashion collection featuring elegant young handsome man style.",
        price: 199.99,
        original_price: 259.99,
        category: "Men",
        stock: 12,
        image: "/formated/elegant-young-handsome-man_1301-5870.avif",
        rating: 4.8,
        reviews: 29,
        discount: 23,
        is_featured: true,
      },
      {
        name: "Confident Stylish Man",
        description:
          "Confident young man stylish dark-haired man standing holding one hand in trouser pocket.",
        price: 179.99,
        category: "Men",
        stock: 15,
        image:
          "/formated/confident-young-man-stylish-darkhaired-man-standing-holding-one-hand-trousers-pocket-looking_386167-2361.avif",
        rating: 4.6,
        reviews: 24,
        is_new: true,
      },
      {
        name: "Handsome Man with Sunglasses",
        description:
          "Handsome man wearing sunglasses standing against grey wall. Modern casual style.",
        price: 159.99,
        original_price: 199.99,
        category: "Men",
        stock: 18,
        image:
          "/formated/handsome-man-wearing-sunglasses-standing-grey-wall_171337-14981.avif",
        rating: 4.7,
        reviews: 31,
        discount: 20,
      },
      {
        name: "Handsome Young Man Sitting",
        description:
          "Handsome young man sitting isolated on grey. Comfortable casual fashion.",
        price: 149.99,
        category: "Men",
        stock: 20,
        image:
          "/formated/handsome-young-man-sitting-isolated-grey_171337-10550.avif",
        rating: 4.5,
        reviews: 22,
      },
      {
        name: "Confident Hipster Style",
        description:
          "Confident hipster looking away while standing. Modern urban fashion.",
        price: 169.99,
        original_price: 209.99,
        category: "Men",
        stock: 14,
        image:
          "/formated/confident-hipster-looking-away-while-standing_13339-191662.avif",
        rating: 4.6,
        reviews: 26,
        discount: 19,
      },
      {
        name: "Young Handsome Hipster Man",
        description:
          "Young handsome hipster man standing with modern urban style. Trendy casual wear.",
        price: 139.99,
        category: "Men",
        stock: 17,
        image: "/formated/young-handsome-hipster-man-standing_285396-1515.avif",
        rating: 4.5,
        reviews: 20,
      },
      {
        name: "Black Pants - Small",
        description:
          "Classic black pants with modern slim fit. Essential wardrobe staple.",
        price: 79.99,
        category: "Men",
        stock: 30,
        image: "/formated/blckpant_small.webp",
        rating: 4.4,
        reviews: 42,
      },
      {
        name: "Cement Kurta",
        description:
          "Traditional cement color kurta with modern design. Perfect for formal occasions.",
        price: 89.99,
        category: "Men",
        stock: 22,
        image: "/formated/cementkurta_small.webp",
        rating: 4.6,
        reviews: 28,
      },
      {
        name: "Gold Kurta",
        description:
          "Elegant gold kurta with traditional embroidery. Perfect for special celebrations.",
        price: 109.99,
        original_price: 139.99,
        category: "Men",
        stock: 15,
        image: "/formated/goldkurta_small.webp",
        rating: 4.7,
        reviews: 25,
        discount: 22,
      },
      {
        name: "Grey Pants",
        description:
          "Versatile grey pants with comfortable fit. Perfect for office and casual wear.",
        price: 74.99,
        category: "Men",
        stock: 28,
        image: "/formated/greypant_small.webp",
        rating: 4.3,
        reviews: 36,
      },
      {
        name: "Light Vennela Kurta",
        description:
          "Light color vennela kurta with delicate design. Comfortable ethnic wear.",
        price: 94.99,
        category: "Men",
        stock: 19,
        image: "/formated/lightvennelakurta_small.webp",
        rating: 4.5,
        reviews: 21,
      },

      // Women's Fashion (9 products)
      {
        name: "Gentle Pretty Woman",
        description:
          "Gentle pretty woman in beige hat and winter coat. Elegant seasonal fashion.",
        price: 189.99,
        original_price: 239.99,
        category: "Women",
        stock: 10,
        image:
          "/formated/gentle-pretty-woman-beige-hat-winter-coat_273443-3776.avif",
        rating: 4.8,
        reviews: 33,
        discount: 21,
        is_featured: true,
      },
      {
        name: "Face People Makeup Female",
        description:
          "Professional face people posing makeup female collection. Beauty and elegance.",
        price: 129.99,
        category: "Women",
        stock: 16,
        image: "/formated/face-people-posing-makeup-female_1303-458.avif",
        rating: 4.7,
        reviews: 28,
        is_new: true,
      },
      {
        name: "Young Elegant Blonde Woman",
        description:
          "Portrait of young elegant blonde woman in black wool hat wearing oversize white fringe poncho with long grey dress.",
        price: 219.99,
        original_price: 279.99,
        category: "Women",
        stock: 8,
        image:
          "/formated/portrait-young-elegant-blonde-woman-black-wool-hat-wearing-oversize-white-fringe-poncho-with-long-grey-dress_273443-3798.avif",
        rating: 4.9,
        reviews: 37,
        discount: 22,
        is_featured: true,
      },
      {
        name: "Smiley Woman in Ukrainian Shirt",
        description:
          "Medium shot smiley woman wearing traditional Ukrainian shirt. Cultural fashion statement.",
        price: 99.99,
        category: "Women",
        stock: 20,
        image:
          "/formated/medium-shot-smiley-woman-wearing-ukranian-shirt_23-2149318813.avif",
        rating: 4.5,
        reviews: 21,
        is_new: true,
      },
      {
        name: "Stylish Woman White Jumper",
        description:
          "Shot of good-looking young woman smiles poses indoor in white jumper and red tights. Shows perfect teeth and enjoys nice day.",
        price: 139.99,
        original_price: 169.99,
        category: "Women",
        stock: 14,
        image:
          "/formated/shot-good-looking-young-woman-smiles-poses-indoor-has-feeling-happiness-hears-positive-news-dressed-white-jumper-red-tights-shows-perfect-teeth-enjoys-nice-day-off_273609-26624.avif",
        rating: 4.6,
        reviews: 25,
        discount: 18,
      },
      {
        name: "Young Teen Woman Shopping",
        description:
          "Young teen woman in sunglasses and hat holding shopping bags feeling happy. Isolated on green wall.",
        price: 109.99,
        category: "Women",
        stock: 18,
        image:
          "/formated/young-teen-woman-sunglasses-hat-holding-shopping-bags-her-hands-feeling-so-happiness-isolated-green-wall_231208-2681.avif",
        rating: 4.6,
        reviews: 27,
      },
      {
        name: "Navy Blue Shirt",
        description:
          "Classic navy blue shirt with modern fit. Perfect for professional and casual wear.",
        price: 64.99,
        category: "Women",
        stock: 25,
        image: "/formated/navyblueshirt_small.webp",
        rating: 4.4,
        reviews: 38,
      },
      {
        name: "Navy Brown Shirt",
        description:
          "Stylish navy brown shirt with unique color combination. Versatile fashion piece.",
        price: 69.99,
        category: "Women",
        stock: 22,
        image: "/formated/navybrownshirt_small.webp",
        rating: 4.5,
        reviews: 31,
      },
      {
        name: "Navy Cement Shirt",
        description:
          "Modern navy cement shirt with contemporary design. Perfect for any occasion.",
        price: 67.99,
        category: "Women",
        stock: 24,
        image: "/formated/navycementshirt_small.webp",
        rating: 4.4,
        reviews: 29,
      },
    ];

    for (const product of sampleProducts) {
      await pool.query(
        `INSERT INTO products (name, description, price, original_price, category, stock, image, rating, reviews, discount, is_new, is_featured)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT DO NOTHING`,
        [
          product.name,
          product.description,
          product.price,
          product.original_price || null,
          product.category,
          product.stock,
          product.image,
          product.rating,
          product.reviews,
          product.discount || null,
          product.is_new || false,
          product.is_featured || false,
        ]
      );
    }
    console.log("Sample products created");

    console.log("\n✅ Database initialization completed successfully!");
    console.log("\n📝 Login Credentials:");
    console.log("Admin: anil@gmail.com / 1234567890");
    console.log("Customer: user@gmail.com / 1234567890");

    process.exit(0);
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
};

initDb();
