/**
 * Content scripts have access to the DOM and can make changes to it.
 * The JavaScript runs in isolation, meaning it won't interfere with JavaScript running on the page, and vice versa.
 * However, it shares the same view of the DOM as the page's scripts.
 */

import { getSubmissionEvents } from './content/submissionEvents'
import { transformCalendar } from './content/transformCalendar'
import { getSessionKey } from './content/utils'
import { PopupEvent } from './types'
import { settings } from './utils/settings'


// listen to events coming from the Popup window.
chrome.runtime.onMessage.addListener(
	async (request, _sender, _sendResponse) => {
		const sessionKey = getSessionKey()

		switch (request.message) {
		case PopupEvent.transformClassesCalendar:
			transformCalendar()
			break
		case PopupEvent.syncSubmissionsToGoogle: {
			const submissionEvents = await getSubmissionEvents(sessionKey)
			console.log(submissionEvents)
			break
		}
		}
	}
)

async function main() {
	const extensionSettings = await settings().get()

	// if the radio button to enable to transform classes calendar is turned on
	if (extensionSettings.isTransformClassesCalendar) {
		const currentUrl = window.location.href
		currentUrl.endsWith('mytimetable/index.php') && transformCalendar()
	}
}

main()
