# Arduino Data Server for **Alco-OL**
A backend server that handles the reception of the data collected from the embedded systems (or dispensers) of the **Alco-OL** project.

## Features
---
- Access to **Alco-OL** Firestore database 
- Express-based API gateways to accept data of embedded systems through `HTTP POST`
- Timeout handling for the embedded systems

## Dependencies
- `npm firebase`
- `npm express`

## How to use
---
For now, the Express server is run directly. 
Run either from the repo directory:
- `node backend\app.js`
- `nodemon backend\app.js` (if you have nodeman)

## API routes
---
The server manages the updating of data to the `firestore` cloud database, but the data it writes are still dependent on the embedded systems. These are the gatweays where the server receives the data.
### 1. `/data`
    Receives `HTTP POST` pushes from dispensers to log new information.
    Request body:
```
JSON {
    DispenserID: <string>,
    Level:<int>
}
```
### 2. `/new`
    Receives `HTTP POST` pushes from unregistered dispensers to log new information or overwrite existing information about a dispenser.
    Request body:
```
JSON {
    DispenserID: <string>,
    Level:<int>
    Location: <string>,
    Floor: <int>,
}
```

## Timeout Handler
---
Apart from accepting information from the embedded systems, this server monitors the activity of the dispensers, and automatically logs inactive dispensers.

This is done through a `Timeout handler` script that is scheduled to run every `30` minutes, which checks through active dispensers for those that have not sent data more than a set timeout period.

### To be added
---
- Firebase authentication
- Web gatewaying or tunneling
- Better UI?