const fs = require("fs");
const { Key } = require('webdriverio');

module.exports = {
	sleep: async (seconds) => {
		return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
	},

	initializeTestVault: async () => {
		await browser;

		await browser.execute(
			"require('electron').ipcRenderer.sendSync('vault-open', 'test/e2e/test_e2e_vault', true)"
		);

		const pluginsDirectory = "test/e2e/test_e2e_vault/.obsidian/plugins/apple-books-import-highlights";

		fs.mkdirSync(pluginsDirectory, { recursive: true });
		fs.copyFileSync("manifest.json", `${pluginsDirectory}/manifest.json`);
		fs.copyFileSync("main.js", `${pluginsDirectory}/main.js`);
		fs.copyFileSync("styles.css", `${pluginsDirectory}/styles.css`);

		await module.exports.sleep(3);

		// Select the element: <button>Trust author and enable plugins</button>;
		await browser.$("div.modal.mod-trust-folder > div.modal-button-container > button:nth-child(1)").click();



		// await browser.execute(
		// 	"app.plugins.setEnable(true);app.plugins.enablePlugin('oapple-books-import-highlights')"
		// );
	},

	cleanupTestVault: () => {
		fs.rmSync("test/e2e/test_e2e_vault", { recursive: true, force: true });
	}
};
