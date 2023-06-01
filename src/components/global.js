import { writable } from 'svelte/store';
import { app, db, getDispenserUIData, onDispenserDataChange, firestoreDataToObj } from '../Firebase';

let globalID = writable(0);

let dispensers = writable([]);
let dispenserData = {};

getDispenserUIData(app, db).then((disps) => {
    disps.forEach((dispenser) => {
        dispenserData[dispenser.id] = dispenser;
    });

    dispensers.set(Array.from(Object.values(dispenserData)));
});

onDispenserDataChange(app, db,
    // new dispenser data is added
    (add_data) => {
        let dispenserID = add_data.DispenserID;

        if (add_data.change_for == "dispenser") {
            // skip adding dispenserData already in dispenserData
            if (dispenserID in dispenserData) return;

            // if dispenser data is added, we might not have location data yet so weuse dummy values for now
            // NOTE: we expect that location data will be added soon
            dispenserData[dispenserID] = firestoreDataToObj(add_data, {Location: null, Floor: -1, MapCoordinates: [-1, -1]});
            return;
        }

        if (add_data.change_for == "location") {
            let data;
            if (dispenserID in dispenserData) {
                // if dispenser already has data, only modify location if they are dummy values
                if (dispenserData[dispenserID].location) return;
                data = dispenserData[dispenserID]
            } else {
                // if location is added without correponsing dispenser data, use dummy values for now
                // NOTE: we expect that dispenser data will be added soon
                data = {level: -1, isActive: false};
            }

            dispenserData[dispenserID] = firestoreDataToObj(data, add_data);
            return;
        }
    },
    (edit_data) => {
        let dispenserID = edit_data.DispenserID;

        // skip if dispenserID has no data yet
        if (!(dispenserID) in dispenserData) return;

        let data = dispenserData[dispenserID];
        if (edit_data.change_for == "dispenser") {
            // convert raw data to string
            // TODO: deduplicate with code from firestoreDataToObj
            const level = {1: 'Low', 2: 'Medium', 3: 'High', '-1': 'Unknown'}
            data.level = level[edit_data.Level];
            data.status = edit_data.isActive ? "Active" : "Inactive";
            console.log("UPDATE DATA", edit_data, data, dispenserData[dispenserID]);
        } else {
            data.location = edit_data.Location;
            data.floor = edit_data.Floor;
            data.xy = edit_data.MapCoordinates;
            console.log("UPDATE LOC", edit_data, data, dispenserData[dispenserID]);
        }

        return;
    },
    (remove_data) => {
        let dispenserID = remove_data.DispenserID;

        // skip if dispenserID has no data yet
        if (!(dispenserID) in dispenserData) return;
        delete dispenserData[remove_data.dispenserID];
    },
    () => { dispensers.set(Array.from(Object.values(dispenserData))); console.log(dispenserData); }
);


export {
    globalID, dispensers
};
