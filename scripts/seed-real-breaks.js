const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id
  });
}

const db = admin.firestore();

const realBreaks = [
  {
    title: "2026 FIFA Prizm HOBBY",
    description: "Premier FIFA Prizm Hobby box break featuring the latest soccer stars and rookies.",
    date: new Date('2026-03-15T10:00:00-05:00'), // EST
    breakFormat: "Random Team",
    pricePerSpot: 25.00,
    totalSpots: 32,
    claimedSpots: 0,
    isActive: true,
    imageURL: null, // Will add images later
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "2026 FIFA Prizm",
    description: "FIFA Prizm break with premium parallels and inserts.",
    date: new Date('2026-03-13T10:00:00-05:00'), // EST
    breakFormat: "Random Team",
    pricePerSpot: 20.00,
    totalSpots: 32,
    claimedSpots: 0,
    isActive: true,
    imageURL: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "2026 FIFA Prizm CHOICE",
    description: "FIFA Prizm CHOICE - Pick your team! Limited spots available.",
    date: new Date('2026-03-29T10:00:00-05:00'), // EST
    breakFormat: "Pick Your Team",
    pricePerSpot: 30.00,
    totalSpots: 30,
    claimedSpots: 0,
    isActive: true,
    imageURL: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "NEW - 2026 EPL Sapphire",
    description: "Brand new EPL Sapphire release! Featuring Premier League's finest.",
    date: new Date('2026-03-27T08:37:00-05:00'), // EST
    breakFormat: "Random Team",
    pricePerSpot: 35.00,
    totalSpots: 20,
    claimedSpots: 0,
    isActive: true,
    imageURL: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "2026 RTWC Select",
    description: "Road to World Cup Select - Premium box with exclusive inserts.",
    date: new Date('2026-04-10T10:00:00-05:00'), // EST
    breakFormat: "Random Team",
    pricePerSpot: 28.00,
    totalSpots: 32,
    claimedSpots: 0,
    isActive: true,
    imageURL: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedBreaks() {
  try {
    console.log('Starting to seed real breaks...');
    
    // Delete existing breaks first (clean slate)
    const existingBreaks = await db.collection('breaks').get();
    const deletePromises = existingBreaks.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);
    console.log(`Deleted ${existingBreaks.size} existing breaks`);

    // Add new real breaks
    const addPromises = realBreaks.map(async (breakData) => {
      const docRef = await db.collection('breaks').add(breakData);
      console.log(`Added: ${breakData.title} (${docRef.id})`);
      return docRef;
    });

    await Promise.all(addPromises);
    
    console.log('\n✅ Successfully seeded 5 real breaks!');
    console.log('\nBreak Schedule:');
    realBreaks.forEach(b => {
      console.log(`- ${b.title}: ${b.date.toLocaleString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: '2-digit',
        timeZone: 'America/New_York'
      })} EST`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding breaks:', error);
    process.exit(1);
  }
}

seedBreaks();
