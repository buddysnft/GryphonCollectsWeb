const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id
  });
}

const db = admin.firestore();

// Realistic soccer teams for FIFA/EPL products
const premierLeagueTeams = [
  'Manchester United', 'Manchester City', 'Liverpool', 'Arsenal', 'Chelsea',
  'Tottenham Hotspur', 'Newcastle United', 'Aston Villa', 'Brighton',
  'West Ham United', 'Crystal Palace', 'Fulham', 'Brentford', 'Everton',
  'Nottingham Forest', 'Wolves', 'Bournemouth', 'Luton Town', 'Burnley', 'Sheffield United'
];

const fifaTeams = [
  'Manchester United', 'Real Madrid', 'Barcelona', 'Bayern Munich', 'PSG',
  'Liverpool', 'Manchester City', 'Chelsea', 'Juventus', 'Inter Milan',
  'AC Milan', 'Atletico Madrid', 'Borussia Dortmund', 'Ajax', 'Benfica',
  'Porto', 'Arsenal', 'Tottenham', 'Roma', 'Napoli',
  'RB Leipzig', 'Lyon', 'Sevilla', 'Valencia', 'Celtic',
  'Rangers', 'Sporting CP', 'Shakhtar Donetsk', 'Fenerbahce', 'Galatasaray'
];

const starPlayers = {
  'Manchester United': ['Bruno Fernandes', 'Marcus Rashford', 'Casemiro'],
  'Real Madrid': ['Vinicius Jr', 'Jude Bellingham', 'Rodrygo'],
  'Barcelona': ['Robert Lewandowski', 'Gavi', 'Pedri'],
  'Bayern Munich': ['Harry Kane', 'Jamal Musiala', 'Leroy Sane'],
  'PSG': ['Kylian Mbappe', 'Ousmane Dembele', 'Gianluigi Donnarumma'],
  'Liverpool': ['Mohamed Salah', 'Virgil van Dijk', 'Darwin Nunez'],
  'Manchester City': ['Erling Haaland', 'Kevin De Bruyne', 'Phil Foden'],
  'Chelsea': ['Cole Palmer', 'Enzo Fernandez', 'Nicolas Jackson'],
  'Arsenal': ['Bukayo Saka', 'Martin Odegaard', 'Gabriel Jesus']
};

const checklists = [
  {
    productName: '2026 FIFA Prizm HOBBY',
    brand: 'Panini',
    year: 2026,
    sport: 'Soccer',
    description: 'Premium FIFA Prizm Hobby box featuring international stars and top parallels.',
    teams: fifaTeams,
    featuredPlayers: [
      ...starPlayers['Real Madrid'],
      ...starPlayers['Barcelona'],
      ...starPlayers['Bayern Munich'],
      ...starPlayers['PSG'],
      ...starPlayers['Manchester City']
    ],
    totalCards: 300,
    rookies: 75,
    inserts: ['Prizm', 'Silver Prizm', 'Gold Prizm', 'Red/Blue Wave', 'Breakaway'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    productName: '2026 FIFA Prizm',
    brand: 'Panini',
    year: 2026,
    sport: 'Soccer',
    description: 'FIFA Prizm retail with premium parallels and inserts.',
    teams: fifaTeams.slice(0, 25),
    featuredPlayers: [
      ...starPlayers['Real Madrid'],
      ...starPlayers['Liverpool'],
      ...starPlayers['Manchester United']
    ],
    totalCards: 250,
    rookies: 60,
    inserts: ['Prizm', 'Silver Prizm', 'Hyper Prizm'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    productName: '2026 FIFA Prizm CHOICE',
    brand: 'Panini',
    year: 2026,
    sport: 'Soccer',
    description: 'FIFA Prizm CHOICE - Pick your team! Limited spots with premium hits.',
    teams: fifaTeams,
    featuredPlayers: [
      'Jude Bellingham', 'Kylian Mbappe', 'Erling Haaland',
      'Vinicius Jr', 'Mohamed Salah', 'Kevin De Bruyne'
    ],
    totalCards: 300,
    rookies: 80,
    inserts: ['Prizm', 'Silver Prizm', 'Gold Prizm', 'Tiger Stripe', 'Scope'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    productName: 'NEW - 2026 EPL Sapphire',
    brand: 'Panini',
    year: 2026,
    sport: 'Soccer',
    description: 'Brand new EPL Sapphire release featuring Premier League\'s finest in stunning Sapphire parallels.',
    teams: premierLeagueTeams,
    featuredPlayers: [
      'Erling Haaland', 'Mohamed Salah', 'Bukayo Saka',
      'Bruno Fernandes', 'Cole Palmer', 'Martin Odegaard',
      'Phil Foden', 'Darwin Nunez'
    ],
    totalCards: 200,
    rookies: 50,
    inserts: ['Sapphire', 'Ruby Sapphire', 'Orange Sapphire', 'Stained Glass', 'Color Blast'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    productName: '2026 RTWC Select',
    brand: 'Panini',
    year: 2026,
    sport: 'Soccer',
    description: 'Road to World Cup Select - Premium box with exclusive World Cup inserts and memorabilia.',
    teams: fifaTeams,
    featuredPlayers: [
      'Kylian Mbappe', 'Lionel Messi', 'Cristiano Ronaldo',
      'Neymar Jr', 'Luka Modric', 'Kevin De Bruyne',
      'Harry Kane', 'Jude Bellingham'
    ],
    totalCards: 275,
    rookies: 70,
    inserts: ['Select', 'Tri-Color', 'Zebra', 'Tie-Dye', 'World Cup Heroes'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedChecklists() {
  try {
    console.log('Starting to seed placeholder checklists...');
    
    // Check if checklists already exist
    const existingChecklists = await db.collection('productChecklists').get();
    console.log(`Found ${existingChecklists.size} existing checklists`);

    // Add new checklists
    for (const checklist of checklists) {
      const docRef = await db.collection('productChecklists').add(checklist);
      console.log(`✅ Added checklist: ${checklist.productName} (${docRef.id})`);
    }
    
    console.log(`\n✅ Successfully seeded ${checklists.length} placeholder checklists!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding checklists:', error);
    process.exit(1);
  }
}

seedChecklists();
