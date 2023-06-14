// Import firestore functions
import { updateDispenser, updateLatest, addDispenser, getLatestField } from './firestore.js';

// Initialize Express
import express from "express";
const app = express();
app.use(express.json());
const router = express.Router()

// Add routes
router.get('*' , (req , res)=>{
    res.send("This is the Alco-OL API endpoint");
});


// Receives HTTP POST pushes from dispensers to log new information
// receives json body with fields {DispenserID, Level}
router.post("/data", async (req, res) => {
    const date = new Date();
    var log = null;
    try {
        const { DispenserID, Level, isActive } = req.body;
        // Update Dispenser collection if Level has changed
        const latestLevel = await getLatestField(DispenserID, "Level");
        if (Level != latestLevel) {
        await updateDispenser(DispenserID, Level, date, isActive);
        }
        // Update DispenserLatest collection for most recent values
        await updateLatest(DispenserID, Level, date, isActive);

        log = `[${date.toLocaleTimeString({ timeZone: 'Asia/Manila' })}] Dispenser ${DispenserID} logged.`
    } catch(e) {
        log = `[${date.toLocaleTimeString({ timeZone: 'Asia/Manila' })}] Failed to log sensor data: ` + e;
      } 
        console.log(log);
        res.send(log);
});

// Receives HTTP POST pushes from unregistered dispensers to log new information.
// This can also be used to overwrite existing information about a dispenser
// receives json body with fields {DispenserID, Level, isActive, Location, Floor, x, y}
router.post("/new", async (req, res) => {
    const date = new Date();
    var log = null;
    try {
      const { DispenserID, Level, isActive, Location, Floor, x, y} = req.body;
  
      await addDispenser(DispenserID,Level,Location,Floor,date,x,y,isActive);
      log = `[${date.toLocaleTimeString('en-US',{ timeZone: 'Asia/Manila' })}] Dispenser ${DispenserID} successfully registered.`
    } catch(e) {
      log = `[${date.toLocaleTimeString('en-US',{ timeZone: 'Asia/Manila' })}] Failed to register: ` + e;
    } 
      console.log(log);
      res.send(log);
});

// Netlify endpoint
import serverless from 'serverless-http';
app.use(`/.netlify/functions/api`, router);
module.exports  = app;
module.exports.handler = serverless(app);

