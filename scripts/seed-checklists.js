const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'gryphon-breaks',
});

const db = admin.firestore();

const checklists = [
  {
    productName: "2024-25 Topps Chrome Premier League",
    brand: "Topps",
    year: "2024-25",
    sport: "soccer",
    league: "Premier League",
    teams: [
      "Arsenal", "Aston Villa", "Bournemouth", "Brentford", "Brighton",
      "Chelsea", "Crystal Palace", "Everton", "Fulham", "Ipswich Town",
      "Leicester City", "Liverpool", "Manchester City", "Manchester United",
      "Newcastle United", "Nottingham Forest", "Southampton", "Tottenham",
      "West Ham", "Wolverhampton"
    ]
  },
  {
    productName: "2024-25 Topps Museum Collection UEFA",
    brand: "Topps",
    year: "2024-25",
    sport: "soccer",
    league: "UEFA Champions League",
    teams: [
      "Real Madrid", "Barcelona", "Bayern Munich", "PSG", "Manchester City",
      "Liverpool", "Arsenal", "Chelsea", "Inter Milan", "AC Milan",
      "Juventus", "Atletico Madrid", "Borussia Dortmund", "RB Leipzig",
      "Bayer Leverkusen", "Porto", "Benfica", "Sporting CP", "Ajax",
      "PSV", "Shakhtar Donetsk", "Dinamo Zagreb", "Red Star Belgrade",
      "Celtic", "Rangers", "Club Brugge", "Copenhagen", "Galatasaray",
      "Fenerbahce", "Sparta Prague", "Slavia Prague", "Young Boys"
    ]
  },
  {
    productName: "2024-25 Panini Prizm Premier League",
    brand: "Panini",
    year: "2024-25",
    sport: "soccer",
    league: "Premier League",
    teams: [
      "Arsenal", "Aston Villa", "Bournemouth", "Brentford", "Brighton",
      "Chelsea", "Crystal Palace", "Everton", "Fulham", "Ipswich Town",
      "Leicester City", "Liverpool", "Manchester City", "Manchester United",
      "Newcastle United", "Nottingham Forest", "Southampton", "Tottenham",
      "West Ham", "Wolverhampton"
    ]
  },
  {
    productName: "2025 Panini Prizm FIFA Club World Cup",
    brand: "Panini",
    year: "2025",
    sport: "soccer",
    league: "FIFA Club World Cup",
    teams: [
      "Real Madrid", "Manchester City", "Bayern Munich", "PSG", "Flamengo",
      "Palmeiras", "River Plate", "Fluminense", "Seattle Sounders", "Club León",
      "Pachuca", "Monterrey", "Al Hilal", "Al Ahly", "Wydad Casablanca",
      "Mamelodi Sundowns", "Auckland City", "Al Ain", "Urawa Red Diamonds",
      "Ulsan Hyundai", "Inter Miami", "Juventus", "Atletico Madrid",
      "Borussia Dortmund", "Porto", "Benfica", "Red Bull Salzburg",
      "Botafogo", "Boca Juniors", "León", "Seattle", "Esperance"
    ]
  }
];

async function seedChecklists() {
  console.log("🌱 Seeding product checklists...\n");

  for (const checklist of checklists) {
    const data = {
      ...checklist,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('productChecklists').add(data);
    console.log(`✅ ${checklist.productName} (${checklist.teams.length} teams)`);
  }

  console.log(`\n✨ Seeded ${checklists.length} product checklists!`);
  process.exit(0);
}

seedChecklists().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
