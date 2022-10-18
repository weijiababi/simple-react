import { isEmptyObject, defer } from '../react-dom/utils'
import {
  beforeRenderComponent,
  renderComponent,
  afterRenderComponent,
} from './component.js'

const stateQueue = []
const renderQueue = []

export function enqueueState(component, stateChange, callback) {
  if (stateQueue.length === 0) {
    defer(flush.bind(null, callback))
  }

  stateQueue.push({
    component,
    stateChange,
  })

  if (renderQueue.every((c) => c !== component)) {
    renderQueue.push(component)
  }
}

export function flush(callback) {
  let item
  let renderCom
  // 以队列的形式，从头部一个一个取出
  while ((item = stateQueue.shift())) {
    const { component, stateChange } = item
    if (isEmptyObject(component.preState)) {
      component.preState = component.state
    }

    if (typeof stateChange === 'function') {
      Object.assign(
        component.state,
        stateChange(component.preState, component.props)
      )
    } else {
      Object.assign(component.state, stateChange)
    }

    component.preState = component.state

    if (typeof callback === 'function') {
      callback(component.state)
    }
  }

  while ((renderCom = renderQueue.shift())) {
    beforeRenderComponent(renderCom)
    renderComponent(renderCom)
    afterRenderComponent(renderCom)
  }
}
