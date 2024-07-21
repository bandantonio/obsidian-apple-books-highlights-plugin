import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
	lang: 'en-US',
	title: "Apple Books\nImport Highlights",
	description: "Import your Apple Books highlights and notes to Obsidian",
	base: '/obsidian-apple-books-highlights-plugin/',
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		logo: '/logo.svg',
		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Get Started', link: '/guide/get-started' }
		],

		search: {
			provider: 'local',
		},

		sidebar: [
			{
				text: 'Guide',
				items: [
					{ text: 'Getting Started', link: '/guide/get-started' },
					{ text: 'Settings', link: '/guide/settings' }
				]
			},
			{
				text: 'Customization',
				items: [
					{ text: 'Templates and variables', link: '/customization/templates-and-variables' },
				]
			}
		],

		socialLinks: [
			{ icon: 'github', link: 'https://github.com/bandantonio/obsidian-apple-books-highlights-plugin' }
		],

		footer: {
			message: "Released under the <a href='https://github.com/bandantonio/obsidian-apple-books-highlights-plugin/blob/master/LICENSE' target='_blank'>MIT License</a>.",
			copyright: "Copyright © 2024-present <a href='https://github.com/bandantonio' target='_blank'>Anton Zolotukhin</a>",
		},
	}
})
