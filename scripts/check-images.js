const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'gryphon-breaks',
});

const db = admin.firestore();

async function checkImages() {
  const snapshot = await db.collection('products').limit(5).get();
  
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log(`\n${data.name}`);
    console.log(`  imageURLs: ${JSON.stringify(data.imageURLs)}`);
  });
  
  process.exit(0);
}

checkImages();
