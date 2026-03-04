const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// High-quality soccer card product images from Unsplash
// These are real soccer card, trophy, and collection images
const soccerCardImages = {
  // Featured products - premium images
  "Topps Chrome": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",  // Soccer cards spread
  "Museum Collection": "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80",  // Trophy/premium card
  "Jude Bellingham": "https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aae?w=800&q=80",  // Player card
  "Max Dowman": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80",  // Action shot
  
  // Additional soccer-related images
  "Panini": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",  // Football cards
  "Prizm": "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80",  // Stadium
  "Select": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80",  // Soccer ball
  "UEFA": "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",  // Trophy
  "Premier League": "https://images.unsplash.com/photo-1527871252447-4ce2c970cfe4?w=800&q=80",  // Player
  "Champions League": "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&q=80",  // Match action
};

async function updateAllProductImages() {
  try {
    const productsSnapshot = await db.collection('products').get();
    
    console.log(`Found ${productsSnapshot.size} products`);
    
    const updates = [];
    
    productsSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const productName = data.name || '';
      
      // Find matching image based on product name
      for (const [keyword, imageURL] of Object.entries(soccerCardImages)) {
        if (productName.includes(keyword)) {
          console.log(`Updating ${productName} with ${keyword} image`);
          updates.push(
            db.collection('products').doc(doc.id).update({ imageURL })
          );
          return; // Only update once per product
        }
      }
      
      // Default fallback for products without specific match
      const defaultImages = [
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
        "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80",
      ];
      const randomImage = defaultImages[Math.floor(Math.random() * defaultImages.length)];
      console.log(`Updating ${productName} with default image`);
      updates.push(
        db.collection('products').doc(doc.id).update({ imageURL: randomImage })
      );
    });
    
    await Promise.all(updates);
    console.log(`✅ Updated ${updates.length} products with soccer card images`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

updateAllProductImages();
