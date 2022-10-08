export function isNil(value) {
  return value === undefined || value === null
}

export function isSameNodeType(dom, vnode) {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return dom.nodeType === 3
  }

  if (
    !isNil(dom) &&
    !isNil(vnode) &&
    vnode.tag &&
    typeof vnode.tag === 'string'
  ) {
    return vnode.tag.toLowerCase() === dom.nodeName.toLowerCase()
  }

  if (
    !isNil(dom) &&
    !isNil(vnode) &&
    vnode.tag &&
    typeof vnode.tag === 'function'
  ) {
    return dom && dom._component && dom._component.constructor === vnode.tag
  }
  return false
}

export function isSameDom(newDom, oldDom) {
  if (!isNil(newDom) && newDom.isEqualNode) {
    return newDom.isEqualNode(oldDom)
  }
  return newDom === oldDom
}

export function removeNode(dom) {
  if (!isNil(dom) && dom.parentNode) {
    dom.parentNode.removeChild(dom)
  }
}

export function isDom(dom) {
  if (typeof HTMLElement === 'object') {
    return dom instanceof HTMLElement
  }
  return (
    !isNil(dom) &&
    typeof dom === 'object' &&
    dom.nodeType === 1 &&
    typeof dom.nodeName === 'string'
  )
}

export function isEmptyObject(obj) {
  return isNil(obj) || Object.keys(obj).length === 0
}

export function defer(fn) {
  return Promise.resolve().then(fn)
}
