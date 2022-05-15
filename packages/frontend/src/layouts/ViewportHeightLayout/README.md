# ViewportHeightLayout

Uses JavaScript to set the height of the layout to `window.innerHeight`. This was created because `100vh` actually refers to the `outerHeight` of the viewport, which would cut off content on mobile browsers when there are toolbars in the browser.
