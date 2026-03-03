const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const breakImages = [
  "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800",  // Soccer cards
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",  // Football cards
  "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800",  // Trophy/award
  "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800",  // Stadium
  "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800",  // Soccer ball
  "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800",  // Action shot
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",  // Cards collection
];

async function addImagesToBreaks() {
  try {
    const breaksSnapshot = await db.collection('breaks').get();
    
    console.log(`Found ${breaksSnapshot.size} breaks`);
    
    const updates = [];
    breaksSnapshot.docs.forEach((doc, index) => {
      const imageURL = breakImages[index % breakImages.length];
      updates.push(
        db.collection('breaks').doc(doc.id).update({ imageURL })
      );
      console.log(`Updating break ${doc.id} with image ${imageURL}`);
    });
    
    await Promise.all(updates);
    console.log(`✅ Updated ${updates.length} breaks with images`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

addImagesToBreaks();
