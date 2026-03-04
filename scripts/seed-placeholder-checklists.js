const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id
  });
}

const db = admin.firestore();

// Real 2024-25 Premier League teams (all 20)
const premierLeagueTeams = [
  'Arsenal', 'Aston Villa', 'Bournemouth', 'Brentford', 'Brighton',
  'Burnley', 'Chelsea', 'Crystal Palace', 'Everton', 'Fulham',
  'Liverpool', 'Luton Town', 'Manchester City', 'Manchester United', 'Newcastle United',
  'Nottingham Forest', 'Sheffield United', 'Tottenham Hotspur', 'West Ham United', 'Wolves'
];

// Real FIFA World Cup 2024 teams (30 international teams)
const fifaTeams = [
  'Argentina', 'Brazil', 'France', 'England', 'Spain',
  'Germany', 'Portugal', 'Belgium', 'Netherlands', 'Italy',
  'Croatia', 'Uruguay', 'Colombia', 'Mexico', 'USA',
  'Denmark', 'Switzerland', 'Senegal', 'Morocco', 'Japan',
  'South Korea', 'Poland', 'Serbia', 'Ukraine', 'Sweden',
  'Austria', 'Ecuador', 'Australia', 'Canada', 'Wales'
];

// Real UEFA Champions League 2024 teams (32 teams)
const uefaTeams = [
  'Manchester City', 'Real Madrid', 'Bayern Munich', 'PSG', 'Barcelona',
  'Inter Milan', 'Benfica', 'AC Milan', 'Napoli', 'Liverpool',
  'Porto', 'Atletico Madrid', 'RB Leipzig', 'Borussia Dortmund', 'Chelsea',
  'Sevilla', 'Juventus', 'Arsenal', 'Shakhtar Donetsk', 'Club Brugge',
  'Celtic', 'Salzburg', 'Sporting CP', 'Ajax', 'Rangers',
  'Feyenoord', 'Union Berlin', 'Lens', 'Real Sociedad', 'Copenhagen',
  'Galatasaray', 'Antwerp'
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
    year: 2024,
    sport: 'Soccer',
    description: 'Premium FIFA World Cup 2024 Prizm Hobby box featuring international stars and top parallels. All 30 World Cup nations included.',
    teams: fifaTeams,
    featuredPlayers: [
      'Kylian Mbappe', 'Lionel Messi', 'Jude Bellingham',
      'Vinicius Jr', 'Erling Haaland', 'Mohamed Salah',
      'Kevin De Bruyne', 'Harry Kane', 'Cristiano Ronaldo'
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
    year: 2024,
    sport: 'Soccer',
    description: 'FIFA World Cup 2024 Prizm with premium parallels and inserts. Featuring top 30 international teams.',
    teams: fifaTeams,
    featuredPlayers: [
      'Kylian Mbappe', 'Jude Bellingham', 'Vinicius Jr',
      'Mohamed Salah', 'Erling Haaland', 'Harry Kane'
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
    year: 2024,
    sport: 'Soccer',
    description: 'FIFA Prizm CHOICE - Pick your team! World Cup 2024 featuring all 30 nations with premium hits.',
    teams: fifaTeams,
    featuredPlayers: [
      'Jude Bellingham', 'Kylian Mbappe', 'Erling Haaland',
      'Vinicius Jr', 'Mohamed Salah', 'Kevin De Bruyne',
      'Lionel Messi', 'Harry Kane'
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
    year: 2024,
    sport: 'Soccer',
    description: 'Premier League 2024-25 Sapphire featuring all 20 EPL clubs in stunning Sapphire parallels.',
    teams: premierLeagueTeams,
    featuredPlayers: [
      'Erling Haaland', 'Mohamed Salah', 'Bukayo Saka',
      'Bruno Fernandes', 'Cole Palmer', 'Martin Odegaard',
      'Phil Foden', 'Darwin Nunez', 'Son Heung-min'
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
    year: 2024,
    sport: 'Soccer',
    description: 'Road to World Cup 2026 Select - Premium box with exclusive inserts featuring 30 international teams.',
    teams: fifaTeams,
    featuredPlayers: [
      'Kylian Mbappe', 'Lionel Messi', 'Cristiano Ronaldo',
      'Jude Bellingham', 'Vinicius Jr', 'Kevin De Bruyne',
      'Harry Kane', 'Erling Haaland', 'Mohamed Salah'
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
