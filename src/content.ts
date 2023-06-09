'use-strict'

import Calendar, { EventObject } from '@toast-ui/calendar'
import dayjs from 'dayjs'


export type MyLMSEventType = 'class' | 'orientation' | 'break' | 'assessments'

export type MyLMSEvent = {
    time: Date
    duration: number
    type: MyLMSEventType
    description: string
}

export function buildMyLMSEvents(): Array<MyLMSEvent> {
	const myLMSEvents: Array<MyLMSEvent> = []
	const sectionCount = 6

	for (let i = 0; i < sectionCount; ++i) {
		const rawSection = Array
			.from<HTMLUListElement>(
				document.querySelectorAll(
					`#timetable > div.timetable-events > ul > li:nth-child(${i + 1}) > ul > li`
				)
			)
			.sort((a, b) => a.offsetTop - b.offsetTop)


		let date: Date | null = null
		let hours = 0

		for (const rs of rawSection) {
			const rsHeight = rs.offsetHeight
			const rsTxt = (rs.textContent || '').trim()

			if (isSpecialTypeOfEvent(rsTxt)) {
				continue
			}

			if (isDate(rsTxt)) {
				const components = getDateComponents(rsTxt)

				date = getJsDate(rsTxt)

				// start times
				// Wednesday
				if (components.day === 3) {
					hours = 17
				}
				// Saturday
				else if (components.day === 6) {
					hours = 8
				}

				continue
			} else if (date !== null) {
				const type = getMyLMSEventType(rsTxt)
				const duration = getDuration(type, rsHeight)

				if (type === 'break') {
					// Wednesday
					if (date.getDay() === 3) {
						hours = 16
					}
					// Saturday
					else if (date.getDay() === 6) {
						hours = 12
					}
				} else 

					date.setHours(hours, 0, 0)

				const event: MyLMSEvent = {
					type,
					duration,
					time: structuredClone(date),
					description: rsTxt,
				}

				myLMSEvents.push(event)

				hours += duration
			}
		}
	}

	return myLMSEvents
}

export function getMyLMSEventType(event: string): MyLMSEventType {
	if (event.toUpperCase().includes('ORIENTATION')) {
		return 'orientation'
	}
    
	if (event.toUpperCase().includes('BREAK')) {
		return 'break'
	}

	if (event.toUpperCase().includes('ASSESSMENTS')) {
		return 'assessments'
	}

	// TODO: logic needs to be better here
	if (event.toUpperCase().includes('-') && event.includes('(')) {
		return 'class'
	}

	throw new Error('Could not determine MyLMSEventType from: ' + event)
}

// something like this: "SAT 22-APR-2023"
const dateRegexp = /^(MON|TUE|WED|THU|FRI|SAT|SUN)\s{1}(\d{2})-(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)-(\d{4})$/


export function isDate(event: string) {
	return dateRegexp.test(event)
}

export function getJsDate(event: string) {
	const res = dateRegexp.exec(event)

	if (res == null || res.length == 0) throw new Error('Could not get JS Date. Pattern does not match')

	const [_, _day, date, shortMonth, year] = res

	const jsDate = new Date(+year, shortMonthToInt(shortMonth) - 1, +date)

	return jsDate
}

export function getDateComponents(event: string) {
	const res = dateRegexp.exec(event)

	if (res == null || res.length == 0) throw new Error('Could not get Date Components. Pattern does not match')

	const [_, shortDay, date, shortMonth, year] = res

	return {
		day: shortDayToInt(shortDay),
		date,
		month: shortMonthToInt(shortMonth),
		year: +year,
	}
}

export function shortMonthToInt(month: string) {
	switch (month.toUpperCase()) {
	case 'JAN': return 1
	case 'FEB': return 2
	case 'MAR': return 3
	case 'APR': return 4
	case 'MAY': return 5
	case 'JUN': return 6
	case 'JUL': return 7
	case 'AUG': return 8
	case 'SEP': return 9
	case 'OCT': return 10
	case 'NOV': return 11
	case 'DEC': return 12
	}

	throw new Error(`Error converting short month to int from: ${month}`)
}

export function shortDayToInt(day: string) {
	switch (day.toUpperCase()) {
	case 'MON': return 1
	case 'TUE': return 2
	case 'WED': return 3
	case 'THU': return 4
	case 'FRI': return 5
	case 'SAT': return 6
	case 'SUN': return 7
	}

	throw new Error(`Error converting short day to int from: ${day}`)
}

export function getDuration(event: MyLMSEventType, height: number) {
	if (event === 'break') return 1

	const sessionPixelHeight = 36
	const duration = Math.floor(height % sessionPixelHeight) || 2
	return duration 
}

export function isSpecialTypeOfEvent(event: string) {
	if (event.includes('AcademicSupport')) {
		return true
	}

	return false
}

export async function loadJS(url: string, async: 'false' | 'true' = 'false'): Promise<HTMLScriptElement> {
	const scriptEle = document.createElement('script')
  
	scriptEle.setAttribute('src', url)
	scriptEle.setAttribute('type', 'text/javascript')
	scriptEle.setAttribute('async', async)

	return scriptEle

	// return new Promise((res, rej) => {
	//     // success event 
	//     scriptEle.addEventListener("load", () => {
	//         res(scriptEle)
	//     })
	//     // error event
	//     scriptEle.addEventListener("error", (err) => {
	//         rej(err)
	//     })
	// })
}

export function loadCss(url: string) {
	const scriptEle = document.createElement('link')
  
	scriptEle.setAttribute('href', url)
	scriptEle.setAttribute('rel', 'stylesheet')
	scriptEle.setAttribute('type', 'text/css')

	return scriptEle
}

export function buildCalendarNav(calendar: Calendar) {
	const css = loadCss('https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css')
	document.getElementsByTagName('head')[0].append(css)

	const h4 = document.createElement('h3')
	h4.className = 'badge text-bg-info'
	h4.style.marginLeft = '10px'

	const updateDate = () => h4.innerText = dayjs(calendar.getDate().toDate()).format('MMMM YYYY')

	updateDate()

	const div = document.createElement('div')

	const nav = document.createElement('nav')
	nav.ariaLabel = 'Calendar navigation'

	const ul = document.createElement('ul')
	ul.className = 'pagination'

	const liToday = document.createElement('li')
	liToday.className = 'page-item'

	const liPrev = document.createElement('li')
	liPrev.className = 'page-item'

	const liNext = document.createElement('li')
	liNext.className = 'page-item'

	const btnToday = document.createElement('button')
	btnToday.type = 'button'
	btnToday.className = 'page-link'
	btnToday.innerText = 'Today'
	btnToday.onclick = () => { calendar.today(); updateDate() }

	const btnPrev = document.createElement('button')
	btnPrev.type = 'button'
	btnPrev.className = 'page-link'
	btnPrev.innerText = 'Previous'
	btnPrev.onclick = () => { calendar.prev(); updateDate() }

	const btnNext = document.createElement('button')
	btnNext.type = 'button'
	btnNext.className = 'page-link'
	btnNext.innerText = 'Next'
	btnNext.onclick = () => { calendar.next(); updateDate() }


	liToday.append(btnToday)
	liNext.append(btnNext)
	liPrev.append(btnPrev)
	ul.append(liToday)
	ul.append(liPrev)
	ul.append(liNext)
	nav.append(ul)


	const dateEle = document.createElement('section')
    
	dateEle.append(h4)

	div.append(nav)
	div.append(dateEle)

	return div
}
  

export function buildCalendar(events: MyLMSEvent[]) {
	const windowInnerWidth  = window.innerWidth
	const windowInnerHeight = window.innerHeight

	const calenderUIId = 'cal1'

	const uniqueId = 'myCalender-' + +new Date()
	const calendarElm = document.createElement('div')
	calendarElm.id = uniqueId
	calendarElm.style.height = Math.floor(windowInnerHeight * 0.8) + 'px'
	calendarElm.style.width = Math.floor(windowInnerWidth * 0.95) + 'px'

	const cssElm = loadCss('https://uicdn.toast.com/calendar/latest/toastui-calendar.min.css')

	document.getElementsByTagName('head')[0].append(cssElm)
    

	document.getElementById('page-content')?.replaceChildren(calendarElm)
    
	const calendar = new Calendar(calendarElm, {
		defaultView: 'month',
		template: {
			time(event: EventObject) {
				const { start, end, title } = event
				return `<span style="color: black;">${dayjs(start).format('HH:mm')} ${title}</span>`
			},
			allday(event: EventObject) {
				return `<span style="color: gray;">${event.title}</span>`
			},
		},
		isReadOnly: true,
		gridSelection: false,
		month: {
			workweek: false,
			startDayOfWeek: 1,
			isAlways6Weeks: false,
		},
		calendars: [
			{
				id: calenderUIId,
				name: 'School',
				backgroundColor: '#03bd9e',
				borderColor: '#ff0101',
			},
		],
	})
    
	calendar.createEvents(
		events
			.filter(event => event.type === 'class')
			.map((event, index) => {
				const evt: EventObject = {
					id: index,
					calendarId: calenderUIId,
					title: event.description,
					category: 'time',
					location: 'online',
					start: event.time,
					end: new Array<MyLMSEventType>('orientation', 'break', 'assessments').includes(event.type) ?
						undefined : dayjs(event.time).add(event.duration, 'hours').toDate(),
					// isAllday: event.type === 'orientation',
				}

				return evt
			}),
	)

	const navElm = buildCalendarNav(calendar)
	document.querySelector('#page-content')?.prepend(navElm)

	window.onresize = calendar.render
}


(function() {
	const events = buildMyLMSEvents()
	buildCalendar(events)

	// const originalTimetable = document.getElementById('timetable')

	// if (originalTimetable) {
	//     originalTimetable.style.display = 'none'
	// }

	document.querySelectorAll('.timetable-events').forEach(e => e.remove())
	document.querySelectorAll('#timetable ul').forEach(e => e.remove())
})()
