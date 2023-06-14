import zod from 'zod'
import dayjs from 'dayjs'


const submissionResponseEventSchema = zod.object({
    "id": zod.number(),
    "name": zod.string(),
    "description": zod.string(),
    "descriptionformat": zod.number(),
    "location": zod.string(),
    "categoryid": zod.number().nullable(),
    "groupid": zod.number().nullable(),
    "userid": zod.number(),
    "repeatid": zod.number().nullable(),
    "eventcount": zod.number().nullable(),
    "component": zod.string(),
    "modulename": zod.string(),
    "activityname": zod.string(),
    "activitystr": zod.string(),
    "instance": zod.number(),
    "eventtype": zod.string(),
    "timestart": zod.number(),
    "timeduration": zod.number(),
    "timesort": zod.number(),
    "timeusermidnight": zod.number(),
    "visible": zod.number(),
    "timemodified": zod.number(),
    "overdue": zod.boolean(),
    "icon": zod.object({
        "key": zod.string(),
        "component": zod.string(),
        "alttext": zod.string()
    }),
    "course": zod.object({
        "id": zod.number(),
        "fullname": zod.string(),
        "shortname": zod.string(),
        "idnumber": zod.string(),
        "summary": zod.string(),
        "summaryformat": zod.number(),
        "startdate": zod.number(),
        "enddate": zod.number(),
        "visible": zod.boolean(),
        "showactivitydates": zod.boolean(),
        "showcompletionconditions": zod.boolean(),
        "fullnamedisplay": zod.string(),
        "viewurl": zod.string(),
        "courseimage": zod.string(),
        "progress": zod.number(),
        "hasprogress": zod.boolean(),
        "isfavourite": zod.boolean(),
        "hidden": zod.boolean(),
        "showshortname": zod.boolean(),
        "coursecategory": zod.string()
    }),
    "subscription": zod.object({
        "displayeventsource": zod.boolean(),
    }),
    "canedit": zod.boolean(),
    "candelete": zod.boolean(),
    "deleteurl": zod.string(),
    "editurl": zod.string(),
    "viewurl": zod.string(),
    "formattedtime": zod.string(),
    "isactionevent": zod.boolean(),
    "iscourseevent": zod.boolean(),
    "iscategoryevent": zod.boolean(),
    "groupname": zod.string().nullable(),
    "normalisedeventtype": zod.string(),
    "normalisedeventtypetext": zod.string(),
    "action": zod.object({
        "name": zod.string(),
        "url": zod.string(),
        "itemcount": zod.number(),
        "actionable": zod.boolean(),
        "showitemcount": zod.boolean(),
    }),
    "purpose": zod.string(),
    "url": zod.string()
})

const submissionResponseSchema = zod.array(zod.object({
    "error": zod.boolean(),
    "data": zod.object({
        "firstid": zod.number(),
        "lastid": zod.number(),
        "events": zod.array(submissionResponseEventSchema),
    }),
}))

export type SubmissionEvent = zod.infer<typeof submissionResponseEventSchema>

/**
 * @param sessionKey 
 * @param limit Limit must be between 1 and 50 (inclusive) 
 */
export async function getSubmissionEvents(sessionKey: string, limit: number = 50): Promise<SubmissionEvent[]> {
    try {
        const url =
            `https://mylms.vossie.net/lib/ajax/service.php?sesskey=${sessionKey}&info=core_calendar_get_action_events_by_timesort`
        const payload = [
            {
                "index": 0,
                "methodname": "core_calendar_get_action_events_by_timesort",
                "args": {
                    "limitnum": limit,
                    "timesortfrom": Math.floor(
                        dayjs().month(0).date(0).toDate().getTime() / 1000
                    ),
                    "limittononsuspendedevents": true
                }
            }
        ]

        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
        })
        const rawEvents = await response.json()

        const parsedEvents = submissionResponseSchema.parse(rawEvents)

        if (parsedEvents.length > 0) {
            return parsedEvents[0].data.events
        }
    } catch (err) {
        console.error(err)
        throw err
    }

    return []
}