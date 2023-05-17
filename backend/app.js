// Initialize Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDoc, doc, setDoc, Timestamp, query, where, getDocs, updateDoc, runTransaction } from "firebase/firestore";

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

// Initialize Express
import express from "express";
const expressApp = express();
const port = 5000;
expressApp.use(express.json());

// Receives HTTP POST pushes from dispensers to log new information
// receives json body with fields {DispenserID, Level}
expressApp.post("/data", async (req, res) => {
  const date = new Date();
  var log = null;
  try {
    const { DispenserID, Level } = req.body;

    // Update Dispenser collection if Level has changed
    const latestLevel = await getLatestField(DispenserID, "Level");
    if (Level != latestLevel) {
      await updateDispenser(DispenserID, Level, date);
    }
    // Update DispenserLatest collection for most recent values
    await updateLatest(DispenserID, Level, date);


    log = `[${date.toLocaleTimeString()}] Dispenser ${DispenserID} logged.`
  } catch(e) {
    log = `[${date.toLocaleTimeString()}] Failed to log sensor data: ` + e;
  } 
    console.log(log);
    res.send(log);
});

// Receives HTTP POST pushes from unregistered dispensers to log new information.
// This can also be used to overwrite existing information about a dispenser
// receives json body with fields {DispenserID, Level, Location, Floor}
expressApp.post("/new", async (req, res) => {
  const date = new Date();
  var log = null;
  try {
    const { DispenserID, Level, Location, Floor } = req.body;

    await addDispenser(DispenserID,Level,Location,Floor,date);
    log = `[${date.toLocaleTimeString()}] Dispenser ${DispenserID} successfully registered.`
  } catch(e) {
    log = `[${date.toLocaleTimeString()}] Failed to register: ` + e;
  } 
    console.log(log);
    res.send(log);
});

// Run the express app on port 5000
expressApp.listen(port, () => {
});

// Backend UI (Best part jk i don't know how to UI design)
expressApp.get("*", async (req, res) => {
  res.send(`Server is running on http://localhost:${port}`);
});

// Schedule a timeout handler
const handlerInterval = 30 * 60 * 1000 // run handler every 30 minutes
const timeBeforeInactive = 30 * 60 * 1000 // age threshold for timeout

setInterval(timeoutHandler, handlerInterval);

// Checks if any of the Dispensers have not logged for a while,
// then log them as inactive
async function timeoutHandler(){
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
      const age = new Date(date - docTimestamp.toDate());

      // if they have not logged for a while, log them as inactive
      if (age > timeBeforeInactive){
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

// Adds a new log in DispenserDB
async function updateDispenser(DispenserID, Level,date, isActive=true){
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
async function addDispenser(DispenserID, Level, Location, Floor, date, isActive=true){
  const locRef = doc(db, LocationDB, 'Loc-'+DispenserID);
  const locEntry = {
    "Location": Location,
    "Floor" : Floor
  } 
  await setDoc(locRef, locEntry);
  await updateDispenser(DispenserID, Level, date, isActive);
  await updateLatest(DispenserID, Level, date, isActive);
}

// To minimize reads, use this only when you need one field from a doc
async function getLatestField(DispenserID,field){
  const latestRef = doc(db, LatestDB, 'Latest'+DispenserID);
  const latestSnap = await getDoc(latestRef);
  const latestField = latestSnap.get(field);
  return latestField;
}



