# Button

A Flocker button with multiple variants and colors. Use where needed.

## Props

`children` - _optional_

- type: `React.ReactNode`
- description: Any content that should be rendered inside the component. e.g.

```jsx
<Button>Hello World!</Button>
<Button><div>Goodbye World!</div></Button>
```

`variant` - _optional_

- type: `'filled'` | `'outlined'`
- default: `filled`

`color` - _optional_

- type: `'primary'` | `'black'` | `'white'`
- default: `'primary'`
- description: The primary color is the Flocker primary color.

`type` - _optional_

- type: `'button'` | `'submit'` | `'reset'`
- description: The type of the button.

`style` - _optional_

- type: `React.CSSProperties`
- description: Any additional styles that should be added to the button. Input as a style object.

`onClick` - _optional_

- type: `(e: React.MouseEvent<HTMLButtonElement>) => void`
- description: A callback function that is called when the button is clicked.
