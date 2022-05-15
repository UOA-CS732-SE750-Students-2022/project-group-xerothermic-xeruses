# StyledExternalLink

Wrapper around the `a`. It plays an underlined animation when hovered over.

## Props

`href` - _required_

- type: `string`
- description: The URL to link to.

`openIn` - _optional_

- type: `'current-tab' | 'new-tab' | 'popup'`
- description: Open link in a new tab or window.

`popupSize` - _optional_

- type: `Object`
- description: Dimensions for popup window, if `openIn === 'popup'`.

`popupSize.height` - _optional_

- type: `number`
- default: `600`
- description: Height of popup window.

`popupSize.width` - _optional_

- type: `number`
- default: `500`
- description: Width of popup window.
