# CalendarList

A stylised calendar list from MUI's checkbox list.

# Props

`calendars`

- type: `Calendar[]`
- description: A list of calendars that a user has imported to their account.

`initialSelectedCalendars`

- type: `Calendar[]`
- description: A list of calendars that a user has previously selected for this particular meeting.

`getSelectedCalendars`

- type: `(calendars: Calendar[]) => void`
- description: A callback function used to fetch the calendars the user has selected.
