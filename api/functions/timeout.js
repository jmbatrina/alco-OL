// Import firestore functions
import { timeoutHandler } from './firestore.js';

// Netlify Scheduled Functions
import { schedule } from '@netlify/functions';

// docAge threshold for timeout in [ms]
const timeBeforeInactive = 30 * 60 * 1000

const handler = async (event,context)=>{
    await timeoutHandler(timeBeforeInactive);
}

// schedule the timeoutHandler to run every 30 minutes
exports.handler = schedule("0/30 * * * *", handler);
