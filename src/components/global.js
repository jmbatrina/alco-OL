import { writable } from 'svelte/store';
import { app, db, getDispenserUIData } from '../Firebase';

let globalID = writable(0);

let dispensers = writable([]);
let dispenserData = {};

getDispenserUIData(app, db).then((disps) => {
    disps.forEach((dispenser) => {
        dispenserData[dispenser.id] = dispenser;
    });

    dispensers.set(Array.from(Object.values(dispenserData)));
});


export {
    globalID, dispensers
};
