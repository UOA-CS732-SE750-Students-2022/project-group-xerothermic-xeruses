# ImportCalModal

Modal that allows a user to import an iCal calendar via link and a given name.

## Props

`open` - _required_

- type: `boolean`
- description: Whether the modal is open or not.

`onClose` - _optional_

- type: `(event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void | undefined`
- description: A callback function that is called when the modal is closed.
