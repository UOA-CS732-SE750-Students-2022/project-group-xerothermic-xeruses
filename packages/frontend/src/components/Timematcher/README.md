# Timematcher

Big grid for displaying available times for the user and other geese in the flock. Time cell is purple if both the
user and others are all available; orange if just the user is available; blue if others are available but the user isn't and
blank if no one is available.

## Props

`dates`

- type: `Date[]`
- description: The dates the grid will show. Only the day, month and year of each date object are set.

`timeRange`

- type: `Date[]`
- description: A date array consisting of two objects - start and end date. Only the hours and minutes of the date objects are set.

`userAvailability`

- type: `Availability[]`
- description: An array of Availabilities which indicate the times when the user is free.

`othersAvailability`

- type: `Availability[]`
- description: An array of Availabilities which indicate the times when all others in the flock are free.
