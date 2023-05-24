# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

---
# Arduino Data Server for Alco-OL

A backend server that handles the reception of the data collected from the embedded systems (or dispensers) of the Alco-OL project.

The API gateway for dispenser POST-ing should already be up at:
`https://alco-ol-backend.netlify.app/.netlify/functions/api/`

API Routes:
### 1. POST to `/data`:
Receives `HTTP POST` pushes from dispensers to log new information.

Route: `https://alco-ol-backend.netlify.app/.netlify/functions/api/data`
Request body:
```
JSON {
    DispenserID: <string>,
    Level:<int>
}
```

### 2. POST to `/new`:
Receives `HTTP POST` pushes from unregistered dispensers to log new information or overwrite existing information about a dispenser.

Route: `https://alco-ol-backend.netlify.app/.netlify/functions/api/new`
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
Apart from accepting information from the embedded systems, this server monitors the activity of the dispensers, and automatically logs inactive dispensers.

## Rebuilding the Data Server

To get a local build of the backend:

```bash
npm run build_backend
```

To deploy and update the current backend data to the live site (use this to suspend/modify the scheduled timeout handler):

```bash
npm run deploy_backend
```