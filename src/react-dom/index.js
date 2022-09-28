import { diff } from './diff.js'

export default {
  render: (vnode, container) => {
    // 挂载前清空被挂载节点
    container.innerHTML = ''
    diff(vnode, null, container)
  },
}
