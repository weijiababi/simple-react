export function isNil(value) {
  return value === undefined || value === null
}

export function isSameNodeType(dom, vnode) {
  if (!isNil(vnode) && vnode.tag && typeof vnode.tag === 'string') {
    return vnode.tag.toLowerCase() === dom.nodeName.toLowerCase()
  }
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
