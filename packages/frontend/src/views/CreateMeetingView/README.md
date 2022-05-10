# CreateMeetingView

A view that allows the user to create a new meeting. It allows the user to:

- Name their meeting.
- Select the dates of their meeting.
- Select the time range of their meeting.

When the user clicks "create", the following happens (in order):

1. Checks that a meeting name, meeting dates, and a valid time range is supplied. If not, the user is prompted to supply valid values.
2. A new meeting is created.
3. The currently logged in user automatically joins the meeting.
4. The user is redirected to the meeting page (coming soon).

If an error occurs at any point, the proccess is aborted and an error message is displayed.
