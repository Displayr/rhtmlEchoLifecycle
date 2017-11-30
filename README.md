An R htmlwidget that echoes all function calls. useful for debugging applications that use html widgets.

License
-------
MIT + file LICENSE © [Displayr](https://www.displayr.com)

Local Test
-------

In R:

    library(devtools)
    install()
    width = 400
    height = 400
    rhtmlEchoLifecycle::draw(width, height, 'abcd')

Developing / Contributing
------

To install for local development: `yarn install`

To run local server: `gulp serve`

To build the `inst` directory: `gulp`