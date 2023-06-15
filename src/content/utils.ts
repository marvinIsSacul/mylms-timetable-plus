export function getSessionKey() {
	const parts = document
		.querySelector<HTMLAnchorElement>('a[href*="logout.php?sesskey="]')
		?.href.split('=')
	
	if (!parts || !parts[1]) {
		throw new Error('Could not get session key')
	}

	return parts[1]
}

export async function loadJS(url: string, async: 'false' | 'true' = 'false'): Promise<HTMLScriptElement> {
	const scriptEle = document.createElement('script')
  
	scriptEle.setAttribute('src', url)
	scriptEle.setAttribute('type', 'text/javascript')
	scriptEle.setAttribute('async', async)

	return scriptEle
}

export function loadCss(url: string) {
	const scriptEle = document.createElement('link')
  
	scriptEle.setAttribute('href', url)
	scriptEle.setAttribute('rel', 'stylesheet')
	scriptEle.setAttribute('type', 'text/css')

	return scriptEle
}
