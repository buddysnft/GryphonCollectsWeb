/**
 * Add placeholder images to products
 * Uses Unsplash for now, Gryphon can replace via admin panel later
 */

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWPo0e5k-RcJGN9wQj_vWmPCpNKyMJh3k",
  authDomain: "gryphon-breaks.firebaseapp.com",
  projectId: "gryphon-breaks",
  storageBucket: "gryphon-breaks.firebasestorage.app",
  messagingSenderId: "667883968094",
  appId: "1:667883968094:web:6f6d36cb05f0c7ad1b31b3",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Product-specific images (thematic placeholders based on product type)
const productImages: Record<string, string[]> = {
  // Museum Collection UEFA (hobby box)
  "6bXP2BZg0szsOYYAzFSM": [
    "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&auto=format&fit=crop&q=80", // Soccer ball close-up
  ],
  // Topps Chrome Premier League (hobby box)
  "7d7CVS94vijK92xRP2Aa": [
    "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80", // Premier League stadium
  ],
  // Max Dowman RC (single card)
  "8a0CtPvlTpBkETmT7Lrw": [
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80", // Soccer action
  ],
  // Jude Bellingham PSA 10 (graded slab)
  "Cjzm4O3whwzCt3XQX5Uv": [
    "https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aae?w=800&auto=format&fit=crop&q=80", // Card collection aesthetic
  ],
};

async function addProductImages() {
  try {
    console.log("🖼️  Adding placeholder images to products...\n");

    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);

    let updated = 0;

    for (const docSnap of snapshot.docs) {
      const productId = docSnap.id;
      const product = docSnap.data();
      
      // Skip if already has images
      if (product.imageURLs && product.imageURLs.length > 0) {
        console.log(`⏭️  ${product.name} - already has images`);
        continue;
      }

      // Get specific image or use generic
      const imageURLs = productImages[productId] || [
        `https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80&sig=${productId.slice(0, 8)}`,
      ];

      await updateDoc(doc(db, "products", productId), {
        imageURLs,
        updatedAt: new Date(),
      });

      console.log(`✅ ${product.name} - added image`);
      updated++;
    }

    console.log(`\n✨ Done! Updated ${updated} products with placeholder images.`);
    console.log("\n📝 Note: These are placeholder images.");
    console.log("   Gryphon can replace them via admin panel at:");
    console.log("   https://gryphon-collects-web.vercel.app/admin/products\n");
    
    process.exit(0);
  } catch (error) {
    console.error("Error adding images:", error);
    process.exit(1);
  }
}

addProductImages();
