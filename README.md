An R htmlwidget that echoes all function calls and optionally saves state on an interval. Useful for debugging applications that use html widgets.

How To Interpret Results
-

There are several different message types:

* `constructor called with W H` : echoing args that are passed to constructor
* `resize called at TIMESTAMP with W H` : echoing args that are passed to resize
* `renderValue called with inputConfig: X, userState: Y` : echoing args that are passed to renderValue
* `IDENTIFIER : jquery: WxH bbox: WxH` : this is echoing two dimension measurements taken at a specific time. Examples include
    * constructor: jquery: 600x0, bbox: 600x0
    * size change at 105ms: jquery: 600x600, bbox: 600x600

Messages are typically added as soon as a function is called. There is also a function that is sampling the the outer container dimensions every 50ms and adding a message any time they change. This loop samples every 50 milliseconds, so the events may appear out of order because of the sampling frequency. Keep this in mind when interpreting results. For example:

* resize called at 2500ms with 600 575
* size change at 2512ms: jquery: 600x575, bbox: 600x575

The above two messages does not imply the container was resized after the resize call, it could be that the change was only detected afterwards (due to the sampling frequency of 50ms).

License
-
MIT + file LICENSE © [Displayr](https://www.displayr.com)

Local Test
-

In R no params:
    
    library(devtools)
    install()
    rhtmlEchoLifecycle::draw()

In R all params:

    library(devtools)
    install()
    rhtmlEchoLifecycle::draw(width=400, height=400, autoSaveStateInterval=1000, name="instance1")

Developing / Contributing
-

### Quick Command Reference

* To install for local development: `yarn install`
* To run local server: `gulp serve`
* To build the `inst` directory: `gulp`

### Details

rhtmlEchoLifecycle relies heavily on [rhtmlBuildUtils](https://github.com/Displayr/rhtmlBuildUtils). You should read through the docs in the rhtmlBuildUtils repo to understand:
 
 1. which gulp tasks are available
 1. the constraints on file layout in your widget project
 1. How to perform visual testing.
 
 Here are a few important notes (both detailed in the rhtmlBuildUtils docs) you must keep in mind:

1. The last thing you do before committing is run `gulp build` to ensure all the autogenerated files are up to date.
2. (With some exceptions) ONLY EDIT THINGS IN these directories: `theSrc`, `bdd`, `docs`, and sometimes `build` !! Many of the other files are auto generated based on the contents of `theSrc`. As an example, if you edit `R/rhtmlTemplate.R` and then run `gulp build` your changes will be DELETED FOREVER!, because `R/rhtmlTemplate.R` is just a copy of `theSrc/R/htmlwidget.R`. See [htmlwidget_build_system](docs/htmlwidget_build_system.md) for more details.

