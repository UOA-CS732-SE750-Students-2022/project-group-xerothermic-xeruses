# SidebarLayout

For views that have a sidebar on the left and content on the right.

## Props

`sidebarContent` - _optional_

- type: `React.ReactNode`
- description: The content to display in the sidebar.

`bodyContent` - _optional_

- type: `React.ReactNode`
- description: The content to display on the right, below the title.

`returnTo` - _optional_

- type: `{ route: string, name: string }`
- description: If defined, a return link on the sidebar that navigates to the specified route.
