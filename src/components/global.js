import { writable } from 'svelte/store';
import { app, db, getDispenserUIData } from '../Firebase';

let globalID = writable(0);

let dispensers = [];

async function getDispenserUIData_cached() {
    if (dispensers.length == 0) {
        dispensers = await getDispenserUIData(app, db);
    }

    return dispensers;
}


export {
    globalID, getDispenserUIData_cached
};
