// List all breaks in Firestore
// Run: node scripts/list-breaks.js

const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

async function listBreaks() {
  console.log('📋 Listing all breaks...\n');
  const breaksSnapshot = await db.collection('breaks').get();
  
  console.log(`Found ${breaksSnapshot.size} total breaks:\n`);

  const breaks = [];
  breaksSnapshot.forEach((doc) => {
    const data = doc.data();
    breaks.push({
      id: doc.id,
      title: data.title,
      date: data.date ? new Date(data.date.seconds * 1000).toLocaleDateString() : 'No date',
      spots: data.totalSpots || 0,
      price: data.price || data.pricePerSpot || 0,
      active: data.isActive !== false,
    });
  });

  // Sort by date
  breaks.sort((a, b) => {
    const dateA = a.date === 'No date' ? 0 : new Date(a.date).getTime();
    const dateB = b.date === 'No date' ? 0 : new Date(b.date).getTime();
    return dateA - dateB;
  });

  breaks.forEach((breakData, index) => {
    const status = breakData.active ? '✅' : '❌';
    console.log(`${index + 1}. ${status} ${breakData.title}`);
    console.log(`   ID: ${breakData.id}`);
    console.log(`   Date: ${breakData.date} | Spots: ${breakData.spots} | Price: $${breakData.price}`);
    console.log('');
  });

  console.log(`📊 Total: ${breaks.length} breaks`);
}

listBreaks().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
