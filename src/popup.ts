import { PopupEvent } from './types'
import { settings } from './utils/settings'


document.addEventListener('DOMContentLoaded', init)


async function init() {
	const rdoTransformClassesCalendar = document.querySelector<HTMLInputElement>('#rdoTransformClassesCalendar')
	const rdoSyncSubmissionsToGoogleCalendar = document.querySelector<HTMLInputElement>('#rdoSyncSubmissionsToGoogleCalendar')

	if (!rdoSyncSubmissionsToGoogleCalendar || !rdoTransformClassesCalendar) {
		return
	}


	const currentUrl = (await chrome.tabs.query({ currentWindow: true, active: true }))[0].url || ''
	const extensionSettings = await settings().get()
	
	rdoSyncSubmissionsToGoogleCalendar.checked = extensionSettings.isSyncSubmissionsToGoogleCalendar
	rdoTransformClassesCalendar.checked = extensionSettings.isTransformClassesCalendar
	rdoTransformClassesCalendar.disabled = !currentUrl.endsWith('mytimetable/index.php')


	rdoTransformClassesCalendar.addEventListener('change', async (evt: Event) => {
		const isChecked = (evt.currentTarget as any).checked
		
		await settings().save({
			...(await settings().get()),
			isTransformClassesCalendar: !!isChecked,
		})
		
		if (isChecked) {
			const [activeTab] = await chrome.tabs.query({ currentWindow: true, active: true })
			if (activeTab?.id) {
				chrome.tabs.sendMessage(activeTab.id, {'message': PopupEvent.transformClassesCalendar})
			}
		}
	})

	
	rdoSyncSubmissionsToGoogleCalendar.addEventListener('change', async (evt) => {
		const isChecked = (evt.currentTarget as any).checked

		await settings().save({
			...(await settings().get()),
			isSyncSubmissionsToGoogleCalendar: !!isChecked,
		})

		if (isChecked) {
			const [activeTab] = await chrome.tabs.query({ currentWindow: true, active: true })
			if (activeTab?.id) {
				chrome.tabs.sendMessage(activeTab.id, {'message': PopupEvent.syncSubmissionsToGoogle})
			}
		}
	})
}
