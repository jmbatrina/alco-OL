// Import firestore functions
import { updateDispenser, updateLatest, addDispenser, getLatestField, timeoutHandler } from './firestore.js';

// Initialize Express
import express from "express";
const app = express();
app.use(express.json());
const port = 5000;

// Add routes
app.get('*' , (req , res)=>{
    res.send("This is the Alco-OL API endpoint");
});

// Receives HTTP POST pushes from dispensers to log new information
// receives json body with fields {DispenserID, Level}
app.post("/data", async (req, res) => {
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

        log = `[${date.toLocaleTimeString({ timeZone: 'Asia/Manila' })}] Dispenser ${DispenserID} logged.`
    } catch(e) {
        log = `[${date.toLocaleTimeString({ timeZone: 'Asia/Manila' })}] Failed to log sensor data: ` + e;
      } 
        console.log(log);
        res.send(log);
});

// Receives HTTP POST pushes from unregistered dispensers to log new information.
// This can also be used to overwrite existing information about a dispenser
// receives json body with fields {DispenserID, Level, Location, Floor, x, y}
app.post("/new", async (req, res) => {
    const date = new Date();
    var log = null;
    try {
      const { DispenserID, Level, Location, Floor, x, y} = req.body;
  
      await addDispenser(DispenserID,Level,Location,Floor,date,x,y);
      log = `[${date.toLocaleTimeString('en-US',{ timeZone: 'Asia/Manila' })}] Dispenser ${DispenserID} successfully registered.`
    } catch(e) {
      log = `[${date.toLocaleTimeString('en-US',{ timeZone: 'Asia/Manila' })}] Failed to register: ` + e;
    } 
      console.log(log);
      res.send(log);
});

// run router on defined port
app.listen(port, () => {
});

// Schedule a timeout handler in [ms]
const handlerInterval = 30 * 60 * 1000 // 30 minutes

// other values for debugging
//const handlerInterval = 10 * 1000 // 10 seconds

setInterval(timeoutHandler, handlerInterval);