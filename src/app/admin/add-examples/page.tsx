"use client";

import { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AddExamplesPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const addExampleBreaks = async () => {
    setLoading(true);
    setResult("");

    try {
      // Example 1: Premier League Teams (20 spots)
      const teamLabels: { [key: number]: string } = {
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
        date: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
        pricePerSpot: 45.00,
        totalSpots: 20,
        claimedSpots: 0,
        breakFormat: 'Pick Your Team' as const,
        teams: Object.values(teamLabels),
        spotLabels: teamLabels,
        imageURL: null,
        youtubeURL: 'https://youtube.com/@gryphoncollects',
        instagramURL: 'https://instagram.com/gryphoncollects',
        status: 'upcoming' as const,
        isActive: true,
        notifyList: [],
        participants: [],
        createdAt: Timestamp.now(),
      };

      // Example 2: Top Soccer Players (30 spots)
      const playerLabels: { [key: number]: string } = {
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
        date: Timestamp.fromDate(new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)),
        pricePerSpot: 35.00,
        totalSpots: 30,
        claimedSpots: 0,
        breakFormat: 'Custom' as const,
        teams: null,
        spotLabels: playerLabels,
        imageURL: null,
        youtubeURL: 'https://youtube.com/@gryphoncollects',
        instagramURL: 'https://instagram.com/gryphoncollects',
        status: 'upcoming' as const,
        isActive: true,
        notifyList: [],
        participants: [],
        createdAt: Timestamp.now(),
      };

      // Example 3: Random Number (32 spots, no custom labels)
      const break3 = {
        title: '2024 Select Soccer Hobby Box - Random Number',
        description: 'Pure random break! Your number gets you all cards matching your spot number.',
        date: Timestamp.fromDate(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)),
        pricePerSpot: 25.00,
        totalSpots: 32,
        claimedSpots: 0,
        breakFormat: 'Random Number' as const,
        teams: null,
        imageURL: null,
        youtubeURL: 'https://youtube.com/@gryphoncollects',
        instagramURL: 'https://instagram.com/gryphoncollects',
        status: 'upcoming' as const,
        isActive: true,
        notifyList: [],
        participants: [],
        createdAt: Timestamp.now(),
      };

      // Add all three breaks
      const doc1 = await addDoc(collection(db, 'breaks'), break1);
      const doc2 = await addDoc(collection(db, 'breaks'), break2);
      const doc3 = await addDoc(collection(db, 'breaks'), break3);

      setResult(`✅ Successfully added 3 example breaks!

1. Premier League Teams (20 spots) - ${doc1.id}
2. Player Names (30 spots) - ${doc2.id}
3. Random Numbers (32 spots) - ${doc3.id}

Go to /breaks to see them!`);
    } catch (error: any) {
      setResult(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-6">Add Example Breaks</h1>
        <p className="text-text-secondary mb-8">
          This will add 3 example breaks to test different spot label types:
        </p>

        <div className="bg-surface border border-border rounded-lg p-6 mb-8">
          <ul className="space-y-3 text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">1.</span>
              <div>
                <strong className="text-text-primary">Premier League Teams</strong> (20 spots)
                <br />
                <span className="text-sm">Grid: 3-4 columns, larger boxes for team names</span>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">2.</span>
              <div>
                <strong className="text-text-primary">Top Soccer Players</strong> (30 spots)
                <br />
                <span className="text-sm">Grid: 3-4 columns, larger boxes for player names</span>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">3.</span>
              <div>
                <strong className="text-text-primary">Random Numbers</strong> (32 spots)
                <br />
                <span className="text-sm">Grid: 6-8 columns, smaller boxes (numbers only)</span>
              </div>
            </li>
          </ul>
        </div>

        <button
          onClick={addExampleBreaks}
          disabled={loading}
          className="bg-primary text-background px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition disabled:opacity-50 w-full mb-6"
        >
          {loading ? 'Adding Breaks...' : 'Add Example Breaks'}
        </button>

        {result && (
          <div className={`p-6 rounded-lg whitespace-pre-wrap ${result.startsWith('✅') ? 'bg-success/20 border border-success text-success' : 'bg-danger/20 border border-danger text-danger'}`}>
            {result}
          </div>
        )}
      </div>
    </div>
  );
}
