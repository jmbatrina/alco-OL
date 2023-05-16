import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBOlgzW7OB7HBijbNFnxQZsMVvXuVytjYU",
  authDomain: "alco-ol.firebaseapp.com",
  projectId: "alco-ol",
  storageBucket: "alco-ol.appspot.com",
  messagingSenderId: "351940179755",
  appId: "1:351940179755:web:fe4ab8d6274c3c9e9a776e",
  measurementId: "G-3M8N12572Y"
};

const app = initializeApp(firebaseConfig);

// Name of Dispenser Collection
const DispenserCol = 'Dispensers';
// Name of Dispenser Location Collection
const DispenserLocationCol = 'DispenserLocs';
// Name of Dispenser Latest Values Collection
const DispenserLatestCol = 'DispenserLatest';

const db = getFirestore(app);
// Get a list of cities from your database
async function getDispenserLatestData(db) {
  const dispenserCol = collection(db, DispenserLatestCol);
  const dispenserSnapshot = await getDocs(dispenserCol);

  const idStart = "Latest".length;
  const dispenserList = dispenserSnapshot.docs.map(doc => {
    let data = doc.data();
    data["DispenserID"] = doc.id.substring(idStart);

    return data;
  });

  return dispenserList;
}

async function getLocations(db) {
  const locCol = collection(db, DispenserLocationCol);
  const locSnapshot = await getDocs(locCol);
  let dispenserLocs = {}

  const idStart = "Loc-".length;
  locSnapshot.docs.forEach(doc => {
    const dispenserID = doc.id.substring(idStart);
    dispenserLocs[dispenserID] = doc.data().Location;
  });

  return dispenserLocs;
}

export {
    app, db, getDispenserLatestData, getLocations
}


