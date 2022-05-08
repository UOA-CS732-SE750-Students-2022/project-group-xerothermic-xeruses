# ParticipantList

List for showing participants of a flock. Renders the list of participants with an avatar of the first letter of the participant's name and their name.

## Props

`participants`

- type: `Participant[] | Participant`
- description: All the participants in a flock. Cannot be null or undefined as there will always be at least one participant (the flock creator themselves). Participant has two properties: `name` and `id`.
