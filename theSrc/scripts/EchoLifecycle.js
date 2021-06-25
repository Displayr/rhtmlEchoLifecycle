/* global document */

import $ from 'jquery'
import _ from 'lodash'
import * as d3 from 'd3'
import deepEqual from 'deep-equal'

class EchoLifecycle {
  static initClass () {
    this.widgetIndex = 0
    this.widgetName = 'echoLifecycle'
  }

  constructor (el, width, height, stateChangedCallback) {
    this.id = `${EchoLifecycle.widgetName}-${EchoLifecycle.widgetIndex++}`
    this.rootElement = _.has(el, 'length') ? el[0] : el
    this.renderValueCalled = false
    this.start = Date.now()

    this.width = width
    this.height = height
    this.state = {}
    this.stateChangedCallback = stateChangedCallback
    this.events = []
    this.pushEvent({ message: `constructor called with ${width} ${height}` })

    this.echoDimensions('constructor')
    this.watchForChangeInDimensions()
  }

  sampleDimensions () {
    try {
      const jqueryRoot = $(this.rootElement)
      const bbox = this.rootElement.getBoundingClientRect()
      return {
        jquery: {
          width: jqueryRoot.width(),
          height: jqueryRoot.height(),
        },
        bbox: {
          width: bbox.width,
          height: bbox.height,
        },
      }
    } catch (err) {
      console.error(`fail in echoDimensions:`)
      console.error(err)

      return null
    }
  }

  watchForChangeInDimensions () {
    this.lastDimensions = this.sampleDimensions()
    this.watchInterval = setInterval(() => {
      const newDimensions = this.sampleDimensions()
      if (!deepEqual(this.lastDimensions, newDimensions)) {
        this.echoDimensions(`size change at ${this.timestamp()}ms`, newDimensions)
      }
      this.lastDimensions = newDimensions
    }, 50)
  }

  timestamp () {
    return Date.now() - this.start
  }

  echoDimensions (identifier, dimensions = this.sampleDimensions()) {
    this.pushEvent({ message: `${identifier}: jquery: ${dimensions.jquery.width}x${dimensions.jquery.height}, bbox: ${dimensions.bbox.width}x${dimensions.bbox.height}` })
    if (this.renderValueCalled) {
      this._draw()
    }
  }

  pushEvent (event) {
    console.log(`Event(${this.events.length}): ${JSON.stringify(event)}`)
    this.events.push(_.assign(event, { count: this.events.length }))
  }

  resize (width, height) {
    this.pushEvent({ message: `resize called at ${this.timestamp()}ms with ${width} ${height}` })
    this.width = width
    this.height = height
    this.echoDimensions('time of resize call')
    return this._draw()
  }

  renderValue (inputConfig, userState) {
    this.renderValueCalled = true
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
    $(this.rootElement).width('100%').height('100%')
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
    const fontSize = 16
    const messageContainerHeight = 2.1 * fontSize
    const messageContainerGutter = 8
    const outerPadding = 6
    const textPadding = 5

    const maxDisplayableEventsCount = Math.floor(this.height / (messageContainerHeight + messageContainerGutter))
    const displayableEventCount = Math.min(this.events.length, maxDisplayableEventsCount)
    const displayableEvents = _.slice(this.events, this.events.length - displayableEventCount, this.events.length)

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
      .attr('x', outerPadding)
      .attr('width', this.width - 2 * outerPadding)
      .attr('height', messageContainerHeight)
      .attr('class', 'message-container')
      .style('fill', '#99ff33')
      .style('stroke', '#4d9900')
      .style('stroke-width', 3)

    enteringCells.append('text')
      .attr('dy', 0)
      .attr('dx', outerPadding + textPadding)
      .attr('class', () => 'message-text')
      .style('dominant-baseline', 'text-before-edge')
      .style('font-size', `${fontSize}px`)
      .style('font-weight', '900')
      .text((d) => `${d.count}: ${d.message}`)
      .call(wrap, this.width - (2 * outerPadding + textPadding), outerPadding + textPadding)
  }
}
EchoLifecycle.initClass()

// attribution : https://bl.ocks.org/mbostock/7555321
function wrap (text, width, dx) {
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
        tspan = text.append('tspan').attr('x', 0).attr('dx', dx).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word)
      }
    }
  })
}

module.exports = EchoLifecycle
