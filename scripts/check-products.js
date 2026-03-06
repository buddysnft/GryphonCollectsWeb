// Quick script to check products in Firestore
const admin = require('firebase-admin');
const serviceAccount = require('../service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkProducts() {
  try {
    const productsSnapshot = await db.collection('products').limit(5).get();
    console.log(`Total products found: ${productsSnapshot.size}`);
    
    if (productsSnapshot.empty) {
      console.log('No products found!');
      return;
    }

    productsSnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`\nProduct: ${doc.id}`);
      console.log(`  Name: ${data.name}`);
      console.log(`  isActive: ${data.isActive}`);
      console.log(`  price: $${data.price}`);
    });

    // Count total
    const allProducts = await db.collection('products').get();
    console.log(`\n=== TOTAL PRODUCTS: ${allProducts.size} ===`);
    
    // Count active
    const activeProducts = await db.collection('products').where('isActive', '==', true).get();
    console.log(`=== ACTIVE PRODUCTS: ${activeProducts.size} ===`);
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  process.exit(0);
}

checkProducts();
