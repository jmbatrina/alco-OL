// Import firestore functions
import { timeoutHandler } from './firestore.js';

// Netlify Scheduled Functions
import { schedule } from '@netlify/functions';

// docAge threshold for timeout in [ms]
const timeBeforeInactive = 30 * 60 * 1000

const handler = async (event,context)=>{
    await timeoutHandler(timeBeforeInactive);
}

const interval = "0/30 * * * *"// 30 minute interval

// Alt values for testing:
//const interval = "0/2 * * * *"// 2 minute interval
//const interval = "0 0 1 * *" // 1 month interval

// schedule the timeoutHandler to run every 30 minutes
exports.handler = schedule(interval, handler);
