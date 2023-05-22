export type MyLMSEventType = 'class' | 'orientation' | 'break' | 'assessments'

export type MyLMSEvent = {
    time: Date
    duration: number
    type: MyLMSEventType
}

export function buildMyLMSEvents(): Array<MyLMSEvent> {
    const events: Array<MyLMSEvent> = []
    const sectionCount = 6
    const sessionPixelHeight = 36;

    for (let i = 0; i < sectionCount; ++i) {
        const rawSection = Array
            .from<HTMLUListElement>(
                document.querySelectorAll(
                    `#timetable > div.timetable-events > ul > li:nth-child(${i + 1}) > ul > li`
                )
            )
            .sort((a, b) => b.offsetTop - a.offsetTop)

        const date
        for (const rs of rawSection) {

        }

        const myLMSEvents = rawSection.map<MyLMSEvent>(rs => {
            const type = getMyLMSEventType(rs.textContent || '')

            return {
                type,
                duration: 0,
                time: new Date(),
            } satisfies MyLMSEvent
        })

        events.push(...myLMSEvents)
    }

    return events
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
    if (event.toUpperCase().includes('-') && event.toUpperCase().includes('G')) {
        return 'class'
    }

    throw new Error('Could not determine MyLMSEventType from: ' + event)
}

export function MyLMSDate(event: string) {
    // something like this: "SAT 22-APR-2023"
    const pattern = /^(MON|TUE|WED|THU|FRI|SAT|SUN)\s{1}(\d{2})-(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)-(\d{4})$/

    const isDate = pattern.test(event)
    const getJsDate = () => {
        const res = pattern.exec(event)

        if (res == null || res.length == 0) throw new Error('Could not get Js Date. Pattern does not match')

        const [_, _day, date, month, year] = res

        const jsDate = new Date(+year, +month - 1, +date)

        return jsDate
    }

    return {
        isDate,
        getJsDate
    }
}
