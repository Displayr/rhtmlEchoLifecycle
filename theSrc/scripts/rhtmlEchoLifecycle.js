/* global HTMLWidgets */

import 'babel-polyfill'
import widgetFactory from './rhtmlEchoLifecycle.factory'

HTMLWidgets.widget({
  name: 'rhtmlEchoLifecycle',
  type: 'output',
  factory: widgetFactory,
})
