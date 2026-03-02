/**
 * Add placeholder images using Firebase Admin SDK (bypasses security rules)
 * Requires serviceAccountKey.json
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'gryphon-breaks',
});

const db = admin.firestore();

const productImages = {
  "6bXP2BZg0szsOYYAzFSM": ["https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&auto=format&fit=crop&q=80"],
  "7d7CVS94vijK92xRP2Aa": ["https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80"],
  "8a0CtPvlTpBkETmT7Lrw": ["https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80"],
  "Cjzm4O3whwzCt3XQX5Uv": ["https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aae?w=800&auto=format&fit=crop&q=80"],
};

async function addProductImages() {
  try {
    console.log("🖼️  Adding placeholder images to products...\n");

    const snapshot = await db.collection('products').get();
    let updated = 0;

    for (const doc of snapshot.docs) {
      const productId = doc.id;
      const product = doc.data();
      
      if (product.imageURLs && product.imageURLs.length > 0) {
        console.log(`⏭️  ${product.name} - already has images`);
        continue;
      }

      const imageURLs = productImages[productId] || [
        `https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80&sig=${productId.slice(0, 8)}`,
      ];

      await doc.ref.update({
        imageURLs,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`✅ ${product.name} - added image`);
      updated++;
    }

    console.log(`\n✨ Done! Updated ${updated} products with placeholder images.`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

addProductImages();
