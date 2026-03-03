const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// High-quality soccer card product images
const productImageFixes = {
  "Jude Bellingham PSA 10": "https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aae?w=800",  // Soccer player card
  "2024-25 Topps Chrome UEFA": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800",  // Soccer cards spread
  "2024-25 Topps Museum Collection": "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800",  // Premium card
  "Max Dowman RC": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800",  // Action shot
};

async function fixProductImages() {
  try {
    const productsSnapshot = await db.collection('products').get();
    
    console.log(`Found ${productsSnapshot.size} products`);
    
    const updates = [];
    productsSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const productName = data.name;
      
      // Check if this product needs a new image
      for (const [namePattern, newImage] of Object.entries(productImageFixes)) {
        if (productName && productName.includes(namePattern)) {
          console.log(`Updating ${productName} (${doc.id}) with new image`);
          updates.push(
            db.collection('products').doc(doc.id).update({ 
              imageURL: newImage 
            })
          );
          break;
        }
      }
    });
    
    await Promise.all(updates);
    console.log(`✅ Updated ${updates.length} product images`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

fixProductImages();
