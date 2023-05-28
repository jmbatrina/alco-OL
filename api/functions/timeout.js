// Import timeout function from firestore.js
import { timeoutHandler } from './firestore.js';

// Import for Netlify Scheduled Functions
import { schedule } from '@netlify/functions';

// set the docAge threshold for timeout in [ms]
const timeBeforeInactive = 30 * 60 * 1000 // 30 minutes

// Timeout handler to pass to netlify
const handler = async (event,context)=>{
    await timeoutHandler(timeBeforeInactive);
    return {statusCode:200,};
}

const interval = "0/30,31 * * * *"

// Alt values for testing:
//const interval = "* * * * *"// 1 minute interval
//const interval = "0/2 * * * *"// 2 minute interval
//const interval = "0 6 * * *" // 6AM daily

// schedule the timeoutHandler to run every interval
exports.handler = schedule(interval, handler);
