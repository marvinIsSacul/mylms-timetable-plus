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
        let hours = 0;

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
                if (components.day === 3 && hours === 0) {
                    hours = 17
                }
                // Saturday
                else if (components.day === 6 && hours === 0) {
                    hours = 8
                }

                continue
            } else if (date !== null) {
                const type = getMyLMSEventType(rsTxt)
                const duration = getDuration(type, rsHeight)

                date.setHours(hours, 0, 0);

                const event: MyLMSEvent = {
                    type,
                    duration,
                    time: structuredClone(date),
                    description: rsTxt,
                }

                if (type === 'class' || type === 'break') {
                    // Wednesday
                    // TODO: Work here!!!
                    // if (date.getDay() === 3) {
                    //     if (hours === 17 && duration === 2)
                    //         hours += duration * 2
                    // }

                    hours += duration
                }

                myLMSEvents.push(event)
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

const events = buildMyLMSEvents()

console.log(events);