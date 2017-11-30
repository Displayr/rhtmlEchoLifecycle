/* global document */

import $ from 'jquery'
import _ from 'lodash'
import * as d3 from 'd3'

class EchoLifecycle {
  static initClass () {
    this.widgetIndex = 0
    this.widgetName = 'echoLifecycle'
  }

  constructor (el, width, height, stateChangedCallback) {
    this.id = `${EchoLifecycle.widgetName}-${EchoLifecycle.widgetIndex++}`
    this.rootElement = _.has(el, 'length') ? el[0] : el
    this.width = width
    this.height = height
    this.state = {}
    this.stateChangedCallback = stateChangedCallback
    this.events = []
    this.pushEvent({ message: `constructor called with ${width} ${height}` })
  }

  pushEvent (event) {
    this.events.push(_.assign(event, { count: this.events.length }))
  }

  resize (width, height) {
    this.pushEvent({ message: `resize called with ${width} ${height}` })
    this.width = width
    this.height = height
    return this._draw()
  }

  renderValue (inputConfig, userState) {
    this.pushEvent({ message: `renderValue called with inputConfig: ${JSON.stringify(inputConfig, {}, 2)}, userState:  ${JSON.stringify(userState, {}, 2)}` })

    this._clearRootElement()
    this._manipulateRootElementSize()
    this._addRootSvgToRootElement()
    return this._draw()
  }

  _clearRootElement () {
    $(this.rootElement).find('*').remove()
  }

  _manipulateRootElementSize () {
  }

  _addRootSvgToRootElement () {
    const anonSvg = $('<svg class="rhtmlwidget-outer-svg">')
      .attr('id', this.id)
      .attr('width', '100%')
      .attr('height', '100%')

    $(this.rootElement).append(anonSvg)

    this.outerSvg = d3.select(anonSvg[0])

    return null
  }

  _draw () {
    const fontSize = 24
    const messageContainerHeight = 3.2 * fontSize
    const messageContainerGutter = 10
    const horizontalPadding = 5

    const maxDisplayableEventsCount = Math.floor(this.height / (messageContainerHeight + messageContainerGutter))
    const displayableEventCount = Math.min(this.events.length, maxDisplayableEventsCount)
    const displayableEvents = _.slice(this.events, this.events.length - displayableEventCount, this.events.length)
    console.log(`this.height ${this.height}, displayableEventCount: ${displayableEventCount}, displayableEvents.length: ${displayableEvents.length}`)

    this.outerSvg.selectAll('.event').remove()

    // NB JQuery insists on lowercasing attributes, so we must use JS directly when setting viewBox ?!
    document.getElementById(this.id).setAttribute('viewBox', `0 0 ${this.width} ${this.height}`)

    const allCells = this.outerSvg.selectAll('.event')
      .data(displayableEvents)

    const enteringCells = allCells.enter()
      .append('g')
        .attr('class', 'event')
        .attr('transform', (d, i) => `translate(0,${i * (messageContainerHeight + messageContainerGutter)})`)

    enteringCells.append('rect')
      .attr('width', this.width)
      .attr('height', messageContainerHeight)
      .attr('class', 'message-container')
      .style('fill', '#99ff33')
      .style('stroke', '#4d9900')
      .style('stroke-width', 3)

    enteringCells.append('text')
      .attr('y', 0)
      .attr('dy', 0)
      .attr('x', horizontalPadding)
      .attr('class', () => 'message-text')
      .style('dominant-baseline', 'text-before-edge')
      .style('font-size', `${fontSize}px`)
      .style('font-weight', '900')
      .text((d) => `${d.count}: ${d.message}`)
      .call(wrap, this.width - horizontalPadding)
  }
}
EchoLifecycle.initClass()

// attribution : https://bl.ocks.org/mbostock/7555321
function wrap (text, width) {
  text.each(function () {
    let text = d3.select(this)
    let words = text.text().split(/\s+/).reverse()
    let word
    let line = []
    let lineNumber = 0
    let lineHeight = 1.1 // ems
    let y = text.attr('y')
    let dy = parseFloat(text.attr('dy'))
    let tspan = text.text(null).append('tspan').attr('x', 0).attr('y', y).attr('dy', dy + 'em')

    while (word = words.pop()) { // eslint-disable-line
      line.push(word)
      tspan.text(line.join(' '))
      if (tspan.node().getComputedTextLength() > width) {
        line.pop()
        tspan.text(line.join(' '))
        line = [word]
        tspan = text.append('tspan').attr('x', 0).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word)
      }
    }
  })
}

module.exports = EchoLifecycle
