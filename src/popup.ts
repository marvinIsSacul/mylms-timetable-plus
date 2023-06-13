export type Settings = {
    isExtensionEnabled: boolean,
}

export function settings() {
	const SETTINGS_KEY = '_myLMS++settings'

	async function save(settings: Settings) {
		localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))

		return settings
	}

	async function get(): Promise<Settings> {
		const rawSettings = localStorage.getItem(SETTINGS_KEY)

		if (rawSettings) {
			return JSON.parse(rawSettings)
		}

		return save(defaultSettings())
	}

	function defaultSettings(): Settings{
		return {
			isExtensionEnabled: true,
		}
	}

	return {
		save,
		get,
	}
}


(async function() {
	let appSettings = await settings().get()

	document
		.querySelector<HTMLInputElement>('#rdoEnableExtension')
		?.addEventListener('change', async (evt: Event) => {
			appSettings.isExtensionEnabled = (evt.currentTarget as any).checked

			appSettings = await settings().save(appSettings)
		})
})()
