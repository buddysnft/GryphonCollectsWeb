import { initializeApp } from "firebase/app";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWPo0e5k-RcJGN9wQj_vWmPCpNKyMJh3k",
  authDomain: "gryphon-breaks.firebaseapp.com",
  projectId: "gryphon-breaks",
  storageBucket: "gryphon-breaks.firebasestorage.app",
  messagingSenderId: "667883968094",
  appId: "1:667883968094:web:6f6d36cb05f0c7ad1b31b3",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const brokenIds = [
  "2wZwkNZSyl8kV0IBgokN",
  "Hu4dTdwRYCQ2kcIMP4wb",
  "kZJ6Exo3Lo6Ktjn09EvE",
  "uSkBwEybzkUqXauPNJHv"
];

async function deleteBrokenBreaks() {
  console.log("🗑️  Deleting 4 broken breaks...\n");
  
  for (const id of brokenIds) {
    try {
      await deleteDoc(doc(db, "breaks", id));
      console.log(`✅ Deleted ${id}`);
    } catch (error) {
      console.error(`❌ Failed to delete ${id}:`, error);
    }
  }
  
  console.log("\n✨ Cleanup complete!");
  process.exit(0);
}

deleteBrokenBreaks();
