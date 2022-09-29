import { createComponent, setComponentProps } from '../react/component'
import { setAttribute } from './dom'
import { isNil } from './utils'

/**
 *
 * @param {虚拟dom} vnode
 * @returns
 */
// 根据传入的vnode生成真实node
export function getActualDom(vnode) {
  if (isNil(vnode) || typeof vnode === 'boolean') {
    return ''
  }

  if (typeof vnode.tag === 'function') {
    const component = createComponent(vnode.tag, vnode.attrs)
    setComponentProps(component, vnode.attrs)
    return component.base
  }

  // 字符串或数字直接添加进去
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(vnode)
  }

  const dom = document.createElement(vnode.tag)

  if (!isNil(vnode.attrs)) {
    Object.keys(vnode.attrs).forEach((key) => {
      const value = vnode.attrs[key]
      setAttribute(dom, key, value)
    })
  }

  if (vnode.children) {
    vnode.children.forEach((childVNode) => {
      const actualChildNode = getActualDom(childVNode)
      dom.appendChild(actualChildNode)
    })
  }

  return dom
}
