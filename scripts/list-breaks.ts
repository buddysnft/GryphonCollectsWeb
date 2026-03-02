import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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

async function listBreaks() {
  const snapshot = await getDocs(collection(db, "breaks"));
  console.log(`\n📊 Total breaks in Firestore: ${snapshot.size}\n`);
  
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log(`- ${data.title}`);
    console.log(`  Status: ${data.status}`);
    console.log(`  ID: ${doc.id}`);
    console.log("");
  });
  
  process.exit(0);
}

listBreaks();
