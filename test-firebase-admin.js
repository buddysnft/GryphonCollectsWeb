// Quick test to verify Firebase Admin initialization works
require('dotenv').config({ path: '.env.local' });

const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

async function testFirebaseAdmin() {
  console.log('=== Testing Firebase Admin Initialization ===\n');

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  console.log('Env vars present:');
  console.log('- PROJECT_ID:', !!projectId);
  console.log('- CLIENT_EMAIL:', !!clientEmail);
  console.log('- PRIVATE_KEY:', !!privateKey);
  console.log('- PRIVATE_KEY length:', privateKey?.length);
  console.log('\nPrivate key format:');
  console.log('- Starts with:', privateKey?.substring(0, 30));
  console.log('- Ends with:', privateKey?.substring(privateKey?.length - 30));

  // Apply the same fix as in firebase-admin.ts
  const fixedKey = privateKey
    .replace(/\\\\n/g, "\n")
    .replace(/\\n/g, "\n");

  console.log('\nAfter fix:');
  console.log('- Starts with:', fixedKey.substring(0, 30));
  console.log('- Contains actual newlines:', fixedKey.includes('\n'));
  console.log('- Line count:', fixedKey.split('\n').length);

  try {
    console.log('\n=== Initializing Firebase Admin ===');
    const app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: fixedKey,
      }),
    });

    console.log('✅ Firebase Admin initialized successfully!');

    const db = getFirestore(app);
    console.log('\n=== Testing Firestore Write ===');
    
    // Try to write a test document
    const testDoc = await db.collection('_test').add({
      test: true,
      timestamp: new Date(),
      message: 'Firebase Admin working!',
    });

    console.log('✅ Test document created:', testDoc.id);

    // Clean up
    await testDoc.delete();
    console.log('✅ Test document deleted (cleanup)');

    console.log('\n🎉 ALL TESTS PASSED! Firebase Admin is working correctly.');
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('Full error:', error);
  }
}

testFirebaseAdmin().catch(console.error);
