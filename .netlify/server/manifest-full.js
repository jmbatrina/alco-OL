export const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["Active-High.png","Active-Low.png","Active-Medium.png","back.png","favicon.png","Inactive-High.png","Inactive-High.png~","Inactive-Low.png","Inactive-Low.png~","Inactive-Medium.png","Inactive-Medium.png~","logo.png","main-bg.png","main-bg.png~"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.2ae1df74.js","app":"_app/immutable/entry/app.127885f6.js","imports":["_app/immutable/entry/start.2ae1df74.js","_app/immutable/chunks/index.07d69958.js","_app/immutable/chunks/singletons.92265e46.js","_app/immutable/entry/app.127885f6.js","_app/immutable/chunks/index.07d69958.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			() => import('./nodes/0.js'),
			() => import('./nodes/1.js'),
			() => import('./nodes/2.js'),
			() => import('./nodes/3.js'),
			() => import('./nodes/4.js'),
			() => import('./nodes/5.js'),
			() => import('./nodes/6.js')
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/floor1",
				pattern: /^\/floor1\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/floor1/Room 105",
				pattern: /^\/floor1\/Room 105\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/floor1/Working Dispenser",
				pattern: /^\/floor1\/Working Dispenser\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/floor2",
				pattern: /^\/floor2\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};
