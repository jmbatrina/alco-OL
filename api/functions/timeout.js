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

// 30 minute timeout interval in cron golang format
const interval = "0,1,30,31 * * * *" 
/* 
currently runs again in the succeeding minute as an adlib solution
to the problem that the firestore write functions don't really
run properly in scheduled functions UNLESS it runs every minute.
*/

// Alt values for testing:

// schedule the timeoutHandler to run every interval
exports.handler = schedule(interval, handler);
