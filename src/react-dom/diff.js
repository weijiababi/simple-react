import { setComponentProps, unmountComponent } from '../react/component.js'
import { getActualDom } from './render.js'
import { isNil, isSameDom, isSameNodeType, removeNode } from './utils'
/**
 *
 * @param {虚拟节点} vnode
 * @param {真实dom} dom
 * @param {挂载节点} container
 */
export function diff(vnode, dom, container) {
  const result = diffNode(dom, vnode)
  if (!isNil(container) && !isNil(result) && result.parentNode !== container) {
    container.appendChild(result)
  }
  return result
}

/**
 *
 * @param {真实dom} dom
 * @param {vnode} vnode
 * @returns
 * 根据输入的真实dom节点和vnode节点进行比对，最后输出比对结果（真实dom）提供渲染
 */
export function diffNode(dom, vnode) {
  let out = dom
  let vnodeClone = vnode

  // 当前dom为空，则直接输出一个真实dom提供渲染
  if (isNil(dom)) {
    return getActualDom(vnode)
  }

  if (isNil(vnode) || typeof vnode === 'boolean') {
    vnodeClone = ''
  }

  // 虚拟节点为字符串，直接比对并返回
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    vnodeClone = String(vnode)
    out = document.createTextNode(vnodeClone) // 最终无论结果如何，输出都会是新字符节点

    // 原节点为字符节点
    if (!isNil(dom) && dom.nodeType === 3) {
      // nodeType: https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType
      if (dom.innerText !== vnodeClone) {
        dom.innerText = vnodeClone
      }
    }

    // 原节点非字符节点，需要替换
    if (!isNil(dom) && dom.nodeType !== 3) {
      if (dom.parentNode) {
        dom.parentNode.replaceChild(out, dom)
      }
    }

    return out
  }

  // 虚拟节点为组件，比对类型，直接返回比对结果（同类型则更新，否则卸载再挂载新组件）
  if (typeof vnode.tag === 'function') {
    return diffComponent(dom, vnode)
  }

  // 当vnode跟dom的标签类型不一致，那就创建新标签节点并转移dom的children到新标签节点上去
  if (typeof vnode.tag === 'string' && !isSameNodeType(dom, vnode)) {
    out = document.createElement(vnode.tag)
    if (dom.childNodes && dom.childNodes.length > 0) {
      let childNodeClone = [...dom.childNodes]
      childNodeClone.forEach((node) => {
        out.appendChild(node)
      })
    }
    if (dom.parentNode) {
      dom.parentNode.replaceChild(out, dom)
    }
  }

  if (
    (out.childNodes && out.childNodes.length > 0) ||
    (vnode.children && vnode.children.length > 0)
  ) {
    diffChildren(out, vnode)
  }

  return out
}

export function diffChildren(out, vnode) {
  const domChildren = out.childNodes || []
  const vChildren = vnode.children || []
  const children = [] // 存储没有key的child
  const keyed = {} // 存储有key的child

  for (let i = 0; i < domChildren.length; i++) {
    let child = domChildren[i]
    let key = child.key
    if (isNil(key)) {
      children.push(child)
    } else {
      keyed[key] = child
    }
  }

  if (vChildren.length > 0) {
    let min = 0
    let childrenLength = children.length
    for (let i in vChildren) {
      let correspondChild // 对应vnode的dom child

      let vChild = vChildren[i]
      let key = vChild && vChild.key
      if (!isNil(key)) {
        correspondChild = !isNil(keyed[key]) ? keyed[key] : null
        keyed[key] = null
      } else if (min < childrenLength) {
        for (let j = min; j < childrenLength; j++) {
          let c = children[j]
          if (!isNil(c) && isSameNodeType(c, vChild)) {
            correspondChild = c
            children[j] = null
            // 如果是在头部找到，则首可以增一，因为下次遍历头部是无效的
            if (j === min) {
              min++
            }
            // 如果是在末尾找到，则尾可以减一，因为下次遍历至最尾也是无效的
            if (j === childrenLength - 1) {
              childrenLength--
            }
            break
          }
        }
      }

      let resultChild = diffNode(correspondChild, vChild)
      let oldDomChild = domChildren[i]
      if (!isSameDom(resultChild, oldDomChild)) {
        // 原先位置为空，直接插入节点
        if (isNil(oldDomChild)) {
          out.appendChild(resultChild)
        } else if (!resultChild || resultChild === oldDomChild.nextSibling) {
          removeNode(oldDomChild)
        } else {
          out.replaceChild(resultChild, oldDomChild)
        }
      }
    }
  }
}

export function diffComponent(dom, vnode) {
  let component = dom ? dom._component : null

  // 相同类型组件,直接更新渲染即可
  if (!isNil(component) && component.constructor === vnode.tag) {
    setComponentProps(component, vnode.attrs)
    return component.base
  }

  // 不同类型组件，移除旧组件，添加新组件
  /**
   * 本质是操作component上所绑定的dom的parentNode，移除该子节点
   */
  if (!isNil(component) && component.constructor !== vnode.tag) {
    unmountComponent(component)
    return getActualDom(vnode)
  }
}
