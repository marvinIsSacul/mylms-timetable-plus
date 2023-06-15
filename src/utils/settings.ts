import zod from 'zod'

const settingsSchema = zod.object({
	isTransformClassesCalendar: zod.boolean().default(false),
	isSyncSubmissionsToGoogleCalendar: zod.boolean().default(false),
})

export type Settings = zod.infer<typeof settingsSchema>

export function settings() {
	async function save(settings: Settings) {
		await chrome.storage.local.set({ settings })
		return settings
	}

	async function get(): Promise<Settings> {
		const settings = settingsSchema.parse((await chrome.storage.local.get('settings')).settings)

		if (settings) return settings

		return save(defaultSettings())
	}

	function defaultSettings(): Settings{
		return {
			isTransformClassesCalendar: true,
			isSyncSubmissionsToGoogleCalendar: false,
		}
	}

	return {
		save,
		get,
	}
}