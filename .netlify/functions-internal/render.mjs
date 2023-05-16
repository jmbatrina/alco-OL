import { init } from '../serverless.js';

export const handler = init({
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["Active-High.png","Active-Low.png","Active-Medium.png","favicon.png","Inactive-High.png","Inactive-High.png~","Inactive-Low.png","Inactive-Low.png~","Inactive-Medium.png","Inactive-Medium.png~","main-bg.png","main-bg.png~"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.29a13260.js","app":"_app/immutable/entry/app.350b8206.js","imports":["_app/immutable/entry/start.29a13260.js","_app/immutable/chunks/index.ad1d4fec.js","_app/immutable/chunks/singletons.a795d2f8.js","_app/immutable/entry/app.350b8206.js","_app/immutable/chunks/index.ad1d4fec.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			() => import('../server/nodes/0.js'),
			() => import('../server/nodes/1.js'),
			() => import('../server/nodes/2.js'),
			() => import('../server/nodes/3.js'),
			() => import('../server/nodes/4.js')
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
				id: "/floor2",
				pattern: /^\/floor2\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
});
