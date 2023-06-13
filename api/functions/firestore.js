//Initialize Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDoc, doc, setDoc, Timestamp, query, where, getDocs } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBOlgzW7OB7HBijbNFnxQZsMVvXuVytjYU",
    authDomain: "alco-ol.firebaseapp.com",
    projectId: "alco-ol",
    storageBucket: "alco-ol.appspot.com",
    messagingSenderId: "351940179755",
    appId: "1:351940179755:web:fe4ab8d6274c3c9e9a776e",
    measurementId: "G-3M8N12572Y" 
  }; 

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const DispenserDB = 'Dispensers';
const LocationDB = 'DispenserLocs';
const LatestDB = 'DispenserLatest';

// Adds a new log in DispenserDB
async function updateDispenser(DispenserID, Level, date, isActive=true){
    const dispenserEntry = {
      "DispenserID": DispenserID,
      "Level": Level,
      "Timestamp" : Timestamp.fromDate(date),
      "isActive": isActive
    }
    const dispenserRef = doc(db, DispenserDB, 'ID:'+DispenserID+'; Date:'+date.toISOString());
    await setDoc(dispenserRef, dispenserEntry);
}

// Updates a log in DispenserLatest
async function updateLatest(DispenserID, Level, date, isActive=true){
    const latestRef = doc(db, LatestDB, 'Latest'+DispenserID);
    const latestEntry = {
      "Level": Level,
      "isActive": isActive,
      "Timestamp" : Timestamp.fromDate(date)
    }
    await setDoc(latestRef, latestEntry);
}

  // Adds new dispenser to collections
async function addDispenser(DispenserID, Level, Location, Floor, date, x=0, y=0, isActive=true){
    const locRef = doc(db, LocationDB, 'Loc-'+DispenserID);
    const locEntry = {
      "Location": Location,
      "Floor" : Floor,
      "MapCoordinates" : [x,y]
    } 
    await setDoc(locRef, locEntry);
    await updateDispenser(DispenserID, Level, date, isActive);
    await updateLatest(DispenserID, Level, date, isActive);
}

async function timeoutHandler(timeBeforeInactive){
    const date = new Date();
    var log = null;
    try {
  
      // get all logs in DispenserLatest
      const q = query(collection(db, LatestDB), where("isActive", "==", true));
      const querySnap = await getDocs(q);
  
      // check if any of the Dispensers have not logged for a while
      const data = querySnap.forEach((doc) => {
        const docId = doc.id.substring("Latest".length);
        const docTimestamp = doc.get("Timestamp");
        const docLevel = doc.get("Level");
        const docAge = new Date(date - docTimestamp.toDate());

        // if they have not logged for a while, log them as inactive
        if (docAge > timeBeforeInactive){
          updateDispenser(docId, docLevel, date, false);
          updateLatest(docId, docLevel, date, false);
          var log = `[${date.toLocaleTimeString()}] Dispenser ${docId} set to inactive.`
          console.log(log);
        }  
      });
      
      log = `[${date.toLocaleTimeString()}] Scheduled timeout handling.`
    } catch(e) {
      log = `[${date.toLocaleTimeString()}] Timeout handler did not execute properly: ` + e;
    } 
      console.log(log);
}

// To minimize reads, use this only when you need one field from a doc
async function getLatestField(DispenserID,field){
    const latestRef = doc(db, LatestDB, 'Latest'+DispenserID);
    const latestSnap = await getDoc(latestRef);
    const latestField = latestSnap.get(field);
    return latestField;
}

export {
    updateDispenser,
    updateLatest,
    addDispenser,
    timeoutHandler,
    getLatestField
};