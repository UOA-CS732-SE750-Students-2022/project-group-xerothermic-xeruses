# CalendarList

A stylised calendar list from MUI's checkbox list.

# Props

`calendars`

- type: `Calendar[]`
- description: A list of calendars that a user has imported to their account.

`onUpdate`

- type: `(calendars: Calendar[]) => void`
- description: A callback function used to fetch the calendars the user has selected.

# Calendar type

The `Calendar` type has the following props: 

`name` 

- type: `string`
- description: A string that represents the name of the calendar the user has assigned it with when it was imported.

`id`

- type: `string`
- description: A string that represents the id of a calendar.

`enabled`

- type: `boolean`
- description: Represents whether the user has selected the calendar to include in the availabilities of this flock or not.

`onEnabledChanged`

- type: `(calendar: Calendar) => void`
- description: A callback function used whenever the enabled property of a calendar has changed in order to update the user's availability for the flock.
