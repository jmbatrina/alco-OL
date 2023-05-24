// Import firestore functions
import { timeoutHandler } from '../functions/firestore.js';

// Schedule a timeout handler
const timeBeforeInactive = 30 * 60 * 1000 // age threshold for timeout
const handlerInterval = 30 * 60 * 1000;

setInterval(()=>{timeoutHandler(timeBeforeInactive)},handlerInterval,timeBeforeInactive);

