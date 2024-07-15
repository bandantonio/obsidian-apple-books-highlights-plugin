const helpers = require('./helpers');

beforeEach(async () => {
	await helpers.initializeTestVault();
});

afterEach(() => {
	helpers.cleanupTestVault();
});

describe('Test plugin within Obsidian instance', () => {
	it('Ensure plugin is enabled', async () => {
	});
});
