exports.config = {
	specs: ["./test/e2e/*.spec.js"],
	exclude: [],
	services: ["electron"],
	capabilities: [
		// {
		// 	maxInstances: 1,
		// 	browserName: "chrome",
		// 	"goog:chromeOptions": {
		// 		binary: "/Applications/Obsidian.app/Contents/MacOS/Obsidian",
		// 		args: process.env.CI ? ["headless"] : [],
		// 	},
		// 	acceptInsecureCerts: true,
		// },
		{
			browserName: "electron",
			browserVersion: "28.2.3",
			"wdio:electronServiceOptions": {
				// custom application args
				appBinaryPath:
					"/Applications/Obsidian.app/Contents/MacOS/Obsidian",
				appArgs: [],
			},
		},
	],
	logLevel: "info",
	bail: 0,
	baseUrl: "http://localhost",
	waitforTimeout: 10000,
	connectionRetryTimeout: 120000,
	connectionRetryCount: 0,
	framework: "mocha",
	reporters: ["spec"],
	mochaOpts: {
		ui: "bdd",
		timeout: 60000,
	},
};
