import { isEmptyObject, defer } from '../react-dom/utils'
import { renderComponent } from './component.js'

const stateQueue = []
const renderQueue = []

export function enqueueState(component, stateChange) {
  if (stateQueue.length === 0) {
    defer(flush)
  }

  stateQueue.push({
    component,
    stateChange,
  })

  if (renderQueue.every((c) => c !== component)) {
    renderQueue.push(component)
  }
}

export function flush() {
  let item
  let renderCom
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
  }

  while ((renderCom = renderQueue.shift())) {
    renderComponent(renderCom)
  }
}
