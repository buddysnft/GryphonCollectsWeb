import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../src/lib/firebase";

// Seed Gryphon's actual upcoming breaks
const breaks = [
  {
    title: "2 Case 2026 Flagship — PYT",
    description: "Pick Your Team, Case Break",
    pricePerSpot: 25,
    totalSpots: 20,
    breakFormat: "Pick Your Team",
    teams: ["Team 1", "Team 2", "Team 3", "Team 4", "Team 5", "Team 6", "Team 7", "Team 8", "Team 9", "Team 10", "Team 11", "Team 12", "Team 13", "Team 14", "Team 15", "Team 16", "Team 17", "Team 18", "Team 19", "Team 20"],
    date: new Date("2026-03-15T19:00:00"),
  },
  {
    title: "2026 FIFA Prizm HOBBY — PYT",
    description: "Pick Your Team, FIFA World Cup Case Break",
    pricePerSpot: 30,
    totalSpots: 32,
    breakFormat: "Pick Your Team",
    teams: null,
    date: new Date("2026-03-20T20:00:00"),
  },
  {
    title: "2026 FIFA Prizm — PYT",
    description: "Pick Your Team, FIFA Prizm Case Break",
    pricePerSpot: 28,
    totalSpots: 32,
    breakFormat: "Pick Your Team",
    teams: null,
    date: new Date("2026-03-25T19:00:00"),
  },
  {
    title: "2026 FIFA Prizm CHOICE — PYT",
    description: "Pick Your Team, FIFA Prizm Choice Break",
    pricePerSpot: 35,
    totalSpots: 32,
    breakFormat: "Pick Your Team",
    teams: null,
    date: new Date("2026-04-01T20:00:00"),
  },
  {
    title: "NEW - 2026 EPL Sapphire — PYT",
    description: "Pick Your Team, Premier League Sapphire Case Break",
    pricePerSpot: 40,
    totalSpots: 20,
    breakFormat: "Pick Your Team",
    teams: null,
    date: new Date("2026-04-05T19:00:00"),
  },
  {
    title: "2026 RTWC Select — PYT",
    description: "Pick Your Team, Road to World Cup Select Case Break",
    pricePerSpot: 32,
    totalSpots: 32,
    breakFormat: "Pick Your Team",
    teams: null,
    date: new Date("2026-04-10T20:00:00"),
  },
  {
    title: "5 Case Topps Chrome EPL 2026 — PYT",
    description: "Pick Your Team, 5-Case Premier League Chrome Break",
    pricePerSpot: 45,
    totalSpots: 20,
    breakFormat: "Pick Your Team",
    teams: null,
    date: new Date("2026-04-15T19:00:00"),
  },
];

async function seedBreaks() {
  if (!db) {
    console.error("❌ Firestore not initialized");
    process.exit(1);
  }

  console.log("🌱 Seeding Gryphon's upcoming breaks...");

  for (const breakData of breaks) {
    try {
      await addDoc(collection(db, "breaks"), {
        ...breakData,
        date: Timestamp.fromDate(breakData.date),
        claimedSpots: 0,
        status: "upcoming",
        imageURL: null,
        youtubeURL: null,
        instagramURL: null,
        isActive: true,
        notifyList: [],
        participants: [],
        players: null,
        createdAt: Timestamp.now(),
      });

      console.log(`✅ ${breakData.title}`);
    } catch (error) {
      console.error(`❌ Failed to seed ${breakData.title}:`, error);
    }
  }

  console.log("\n✨ Seeding complete!");
}

seedBreaks();
