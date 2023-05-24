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
# Dispensers Backend Data Server

The API gateway for dispenser POST-ing should already be up at

`https://alco-ol-backend.netlify.app/.netlify/functions/api/`

Routes:
1. POST to `/data`:
```https://alco-ol-backend.netlify.app/.netlify/functions/api/data```
2. POST to `/new`:
```https://alco-ol-backend.netlify.app/.netlify/functions/api/new```

## Rebuilding the Data Server

To get a local build of the backend:

```bash
npm run build_backend
```

To (re)deploy and update the current backend data to the live site:

```bash
npm run deploy_backend
```