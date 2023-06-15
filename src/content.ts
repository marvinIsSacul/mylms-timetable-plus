'use-strict'

import { getSubmissionEvents } from './content/submissionEvents'
import { transformCalendar } from './content/transformCalendar'
import { getSessionKey } from './content/utils'
import { PopupEvent } from './types'
import { settings } from './utils/settings'


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

	if (extensionSettings.isTransformClassesCalendar) {
		const currentUrl = window.location.href
		currentUrl.endsWith('mytimetable/index.php') && transformCalendar()
	}
}

main()
