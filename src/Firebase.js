import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';

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

const LatestDocPrefix = "Latest";
const LocationDocPrefix = "Loc-";

const db = getFirestore(app);
// Get a list of cities from your database
async function getDispenserLatestData(db) {
  const dispenserCol = collection(db, DispenserLatestCol);
  const dispenserSnapshot = await getDocs(dispenserCol);

  const idStart = LatestDocPrefix.length;
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

  const idStart = LocationDocPrefix.length;
  locSnapshot.docs.forEach(doc => {
    const dispenserID = doc.id.substring(idStart);
    dispenserLocs[dispenserID] = doc.data();
  });

  return dispenserLocs;
}


async function getDispenserUIData(app, db) {
    let disp = await getDispenserLatestData(db);
    console.log("Dispensers from getDispenserData");
    console.log(disp);

    let locations = await getLocations(db);
    console.log("Locations from getLocations");
    console.log(locations);

    // translate raw data to strings
    let dispensers = [];
    const level = {1: 'Low', 2: 'Medium', 3: 'High'}
    disp.forEach(dispenser => {
        const { Location, Floor } = locations[dispenser.DispenserID];
        dispensers.push({ location: Location, floor: Floor,level: level[dispenser.Level],
                          status: dispenser.isActive ? "Active" : "Inactive" });
    });
    console.log("Dispensers")
    console.log(dispensers)

    return dispensers;
}

async function getDispenserLogs(app, db, dispenserID) {
  const dispenserCol = collection(db, DispenserCol);
  // Get all logs for the unit corresponding to dispenserID
  const dispenserLogCols = query(dispenserCol, where("DispenserID", "==", dispenserID));
  const logSnapshots = await getDocs(dispenserLogCols);
  let logData = logSnapshots.docs.map((doc) => doc.data());

  // NOTE: since latest data is not in log yet, we manually add it
  const latestDocName = LatestDocPrefix + dispenserID;
  const currDataSnapshot = await getDoc(doc(db, DispenserLatestCol, latestDocName));
  logData.push(currDataSnapshot.data());

  // Sort logs in chronological order (increasing date)
  logData.sort((logA, logB) => (logA.Timestamp - logB.Timestamp));

  // translate raw data to strings; construct corresponding message
  let logs = [];
  let prevLevel = -1;
  let isPrevInactive = false;
  logData.forEach((log) => {
    // TODO: simplify timestamp representation (currently contains too much information)
    const timestamp = log.Timestamp.toDate();
    let logEntry = { DispenserID: log.DispenserID, level: log.Level, status: log.isActive ? "Active" : "Inactive", timestamp: timestamp};
    // TODO: get actual location from database. Hardcoded for now to minimize firestore reads
    logEntry["location"] = "Working Dispenser";

    let message = "";
    if (logEntry.status == "Inactive") {
      // TODO: use more informative error message
      message = "Unit is Inactive";
      isPrevInactive = true;
      prevLevel = -1;
    } else {
      if (isPrevInactive) {
        message = "Unit Reactivated. ";
        isPrevInactive = false;
      }

      const level = {1: 'Low', 2: 'Medium', 3: 'High'}
      // TODO: use more informative log messages
      if (log.Level < prevLevel) {
        message += "Dropped to ";
      } else if (prevLevel != -1 && log.Level > prevLevel) {
        message += "Refilled to ";
      } else {
        message += "Alcohol is at ";
      }

      message += (level[log.Level] ?? "UNKNOWN") + " Level";
      prevLevel = log.Level;
    }

    logEntry["message"] = message;
    logs.push(logEntry);
  });

  // logs are shown in reverse chronological order (most recent first)
  // NOTE: we can't use toReversed() since firefox does not support it yet
  logs.reverse();
  return logs;
}


export {
    app, db, getDispenserLatestData, getLocations, getDispenserUIData, getDispenserLogs
}


