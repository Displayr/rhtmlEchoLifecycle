import EchoLifecycle from './EchoLifecycle'

module.exports = function (element, width, height, stateChangedCallback) {
  const instance = new EchoLifecycle(element, width, height, stateChangedCallback)
  return {
    resize (newWidth, newHeight) {
      instance.resize(newWidth, newHeight)
    },

    renderValue (inputConfig, userState) {
      instance.renderValue(inputConfig, userState)
    },
  }
}
