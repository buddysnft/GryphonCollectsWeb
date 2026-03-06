/**
 * Add example breaks with different spot label types
 * Run with: node scripts/add-example-breaks.js
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID || 'gryphon-breaks',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    })
  });
}

const db = admin.firestore();

async function addExampleBreaks() {
  console.log('Adding example breaks with different spot types...\n');

  // Example 1: Premier League Teams (20 spots)
  const teamLabels = {
    1: 'Arsenal',
    2: 'Aston Villa',
    3: 'Bournemouth',
    4: 'Brentford',
    5: 'Brighton',
    6: 'Chelsea',
    7: 'Crystal Palace',
    8: 'Everton',
    9: 'Fulham',
    10: 'Liverpool',
    11: 'Man City',
    12: 'Man United',
    13: 'Newcastle',
    14: 'Nottm Forest',
    15: 'Southampton',
    16: 'Tottenham',
    17: 'West Ham',
    18: 'Wolves',
    19: 'Leicester',
    20: 'Leeds United',
  };

  const break1 = {
    title: '2023-24 Topps Chrome Premier League - Pick Your Team',
    description: 'Pick your favorite Premier League team! Each spot represents one team. All cards from your team are yours.',
    date: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // 7 days from now
    pricePerSpot: 45.00,
    totalSpots: 20,
    claimedSpots: 0,
    breakFormat: 'Pick Your Team',
    teams: Object.values(teamLabels),
    spotLabels: teamLabels,
    imageURL: null,
    youtubeURL: 'https://youtube.com/@gryphoncollects',
    instagramURL: 'https://instagram.com/gryphoncollects',
    status: 'upcoming',
    isActive: true,
    notifyList: [],
    participants: [],
    createdAt: admin.firestore.Timestamp.now(),
  };

  // Example 2: Top Soccer Players (30 spots)
  const playerLabels = {
    1: 'Haaland',
    2: 'Mbappé',
    3: 'Salah',
    4: 'De Bruyne',
    5: 'Vini Jr',
    6: 'Bellingham',
    7: 'Kane',
    8: 'Son',
    9: 'Saka',
    10: 'Foden',
    11: 'Rodri',
    12: 'Ødegaard',
    13: 'Bruno F.',
    14: 'Rashford',
    15: 'Palmer',
    16: 'Rice',
    17: 'Watkins',
    18: 'Isak',
    19: 'Hojlund',
    20: 'Jackson',
    21: 'Diaz',
    22: 'Toney',
    23: 'Solanke',
    24: 'Martinelli',
    25: 'Darwin',
    26: 'Grealish',
    27: 'Alvarez',
    28: 'Havertz',
    29: 'Gordon',
    30: 'Bowen',
  };

  const break2 = {
    title: '2024 Panini Prizm EPL - Pick Your Player',
    description: 'Choose your favorite player! Each spot represents one player. Get all their cards from the box.',
    date: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)), // 10 days from now
    pricePerSpot: 35.00,
    totalSpots: 30,
    claimedSpots: 0,
    breakFormat: 'Custom',
    teams: null,
    spotLabels: playerLabels,
    imageURL: null,
    youtubeURL: 'https://youtube.com/@gryphoncollects',
    instagramURL: 'https://instagram.com/gryphoncollects',
    status: 'upcoming',
    isActive: true,
    notifyList: [],
    participants: [],
    createdAt: admin.firestore.Timestamp.now(),
  };

  // Example 3: Random Number (32 spots, no custom labels)
  const break3 = {
    title: '2024 Select Soccer Hobby Box - Random Number',
    description: 'Pure random break! Your number gets you all cards matching your spot number.',
    date: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)), // 5 days from now
    pricePerSpot: 25.00,
    totalSpots: 32,
    claimedSpots: 0,
    breakFormat: 'Random Number',
    teams: null,
    // No spotLabels - just numbers
    imageURL: null,
    youtubeURL: 'https://youtube.com/@gryphoncollects',
    instagramURL: 'https://instagram.com/gryphoncollects',
    status: 'upcoming',
    isActive: true,
    notifyList: [],
    participants: [],
    createdAt: admin.firestore.Timestamp.now(),
  };

  try {
    // Add all three example breaks
    const doc1 = await db.collection('breaks').add(break1);
    console.log('✅ Added Premier League Team Break:', doc1.id);

    const doc2 = await db.collection('breaks').add(break2);
    console.log('✅ Added Player Name Break:', doc2.id);

    const doc3 = await db.collection('breaks').add(break3);
    console.log('✅ Added Random Number Break:', doc3.id);

    console.log('\n🎉 All example breaks added successfully!');
    console.log('\nBreak Types Created:');
    console.log('1. Team Names (20 spots, grid-cols-3-4)');
    console.log('2. Player Names (30 spots, grid-cols-3-4)');
    console.log('3. Numbers Only (32 spots, grid-cols-6-8, smaller)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding breaks:', error);
    process.exit(1);
  }
}

addExampleBreaks();
