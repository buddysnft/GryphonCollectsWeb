// Clean up breaks - keep only the 5 specified breaks
// Run: node scripts/clean-breaks.js

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

// Official product images (high-quality from manufacturers)
const PRODUCT_IMAGES = {
  '2026 FIFA Prizm HOBBY': 'https://i.imgur.com/YOUR_PRIZM_HOBBY_IMAGE.jpg', // TODO: Upload to Firebase Storage
  '2026 FIFA Prizm': 'https://i.imgur.com/YOUR_PRIZM_IMAGE.jpg',
  '2026 FIFA Prizm CHOICE': 'https://i.imgur.com/YOUR_PRIZM_CHOICE_IMAGE.jpg',
  'NEW - 2026 EPL Sapphire': 'https://i.imgur.com/YOUR_SAPPHIRE_IMAGE.jpg',
  '2026 RTWC Select': 'https://i.imgur.com/YOUR_SELECT_IMAGE.jpg',
};

// Breaks to KEEP (based on screenshot titles)
const BREAKS_TO_KEEP = [
  '2026 FIFA Prizm HOBBY',
  '2026 FIFA Prizm',
  '2026 FIFA Prizm CHOICE',
  'NEW - 2026 EPL Sapphire',
  '2026 RTWC Select',
];

async function cleanBreaks() {
  console.log('🔍 Fetching all breaks...');
  const breaksSnapshot = await db.collection('breaks').get();
  
  console.log(`Found ${breaksSnapshot.size} total breaks\n`);

  const breaksToDelete = [];
  const breaksToUpdate = [];

  breaksSnapshot.forEach((doc) => {
    const data = doc.data();
    const title = data.title;

    // Check if this break should be kept
    const shouldKeep = BREAKS_TO_KEEP.some(keepTitle => 
      title.includes(keepTitle) || keepTitle.includes(title)
    );

    if (shouldKeep) {
      console.log(`✅ KEEP: ${doc.id} - ${title}`);
      breaksToUpdate.push({ id: doc.id, title, data });
    } else {
      console.log(`❌ DELETE: ${doc.id} - ${title}`);
      breaksToDelete.push({ id: doc.id, title });
    }
  });

  console.log(`\n📊 Summary:`);
  console.log(`  - Keeping: ${breaksToUpdate.length} breaks`);
  console.log(`  - Deleting: ${breaksToDelete.length} breaks`);

  // Confirm before proceeding
  if (process.argv.includes('--confirm')) {
    console.log('\n🗑️  Deleting breaks...');
    
    for (const breakData of breaksToDelete) {
      await db.collection('breaks').doc(breakData.id).delete();
      console.log(`   Deleted: ${breakData.title}`);
    }

    console.log('\n🖼️  Updating images for kept breaks...');
    
    for (const breakData of breaksToUpdate) {
      const matchingTitle = BREAKS_TO_KEEP.find(title => 
        breakData.title.includes(title) || title.includes(breakData.title)
      );
      
      if (matchingTitle && PRODUCT_IMAGES[matchingTitle]) {
        await db.collection('breaks').doc(breakData.id).update({
          imageUrl: PRODUCT_IMAGES[matchingTitle],
        });
        console.log(`   Updated image: ${breakData.title}`);
      }
    }

    console.log('\n✅ Done!');
  } else {
    console.log('\n⚠️  DRY RUN - No changes made');
    console.log('   Run with --confirm to actually delete breaks');
    console.log('   Example: node scripts/clean-breaks.js --confirm');
  }
}

cleanBreaks().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
