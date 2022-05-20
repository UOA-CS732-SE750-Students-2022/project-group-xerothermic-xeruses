# Sidebar

A sidebar which contains a heading at the top and the Flocker logo at the bottom. Any content should be inserted as the component's `children`

## Props

`children` - _optional_

- type: `React.ReactNode`
- description: Any content that should be rendered inside the component. e.g.

```jsx
<SideBar>
  <a href="#">My link</a>
</SideBar>
```

`username` - _optional_

- type: `string`
- default: `null`
- description: The user's name that the header will display. If set, the header will display `Hi ${username}`. If not, it will simply say `Hello!`

`returnTo` - _optional_

- type: `{ route: string, name: string }`
- description: If defined, a return link on the sidebar that navigates to the specified route.
