# MeetingCard

A card that represents a small summary of a meeting. Shows the meeting title, the number of participants, and the date range.

## Props

`title` - _required_

- type: `string`
- default: `'primary'`
- description: The title of the meeting.

`numParticipants` - _required_

- type: `number`
- description: The number of participants in the meeting.

`dateRange` - _required_

- type: `[Date, Date]`
- description: The title of the meeting.

`onClick` - _optional_

- type: `React.MouseEventHandler`
- description: The callback function to call when the card is clicked.
