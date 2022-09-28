/**
 *
 * @param {目标dom节点} dom
 * @param {节点attr key字符串} key
 * @param {节点attr key值} value
 * @returns
 */
// 判断key名并给目标dom节点添加属性
export function setAttribute(dom, key, value) {
  // 类名
  if (key === 'className') {
    dom.setAttribute('class', value)
    return
  }

  // 监听事件
  if (/on\w+/.test(key)) {
    dom[key.toLowerCase()] = value
    return
  }

  // 样式
  if (key === 'style') {
    if (!value) {
      return
    }
    if (typeof value === 'string') {
      dom.style.cssText = value
      return
    } else if (typeof value === 'object') {
      Object.keys(value).forEach((styleKey) => {
        const styleValue =
          typeof value[styleKey] === 'number'
            ? value[styleKey] + 'px'
            : value[styleKey]
        dom.style[styleKey] = styleValue
      })
      return
    }
  }

  dom.removeAttribute(key)
  dom.setAttribute(key, value)
}
