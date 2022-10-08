import { diffNode } from '../react-dom/diff.js'
import { isNil } from '../react-dom/utils.js'
import { enqueueState } from './queue'

class Component {
  constructor(props = {}) {
    this.state = {}
    this.preState = {}
    this.props = props
    this.isReactComponent = true
    this.isMounted = false
  }

  setState(changedState) {
    enqueueState(this, changedState)
  }

  render() {}

  componentWillReceiveProps(props) {}

  shouldComponentUpdate() {}

  componentWillMount() {}
  componentDidMount() {}

  componentWillUpdate() {}
  componentDidUpdate() {}

  componentWillUnmount() {}
}

export function createComponent(fn, attrs) {
  let inst
  // 判断是否为类定义组件,也就是直接使用React.Component创建
  if (fn.prototype && fn.prototype.render) {
    inst = new fn(attrs)
    inst.isReactComponent = true

    let instRender = inst.render.bind(inst)
    inst.render = function () {
      const element = instRender()
      if (!isNil(attrs.key)) {
        element.key = attrs.key
        element.attrs.key = attrs.key
      }
      return element
    }
    // 非类定义组件，为函数组件，需要转为类定义组件
  } else {
    inst = new Component(attrs)
    inst.constructor = fn
    inst.isReactComponent = false
    inst.render = function () {
      /**
       * 非状态组件可能外部传入key，此时需要手动将key绑定给element及attrs上
       */
      const element = this.constructor(this.props)
      if (!isNil(this.props.key)) {
        element.key = this.props.key
        element.attrs.key = this.props.key
      }
      return element // 直接输出函数组件的返回值
    }
  }
  return inst
}

export function setComponentProps(component, props) {
  // 更新props前，先更新
  if (component.isReactComponent && component.componentWillReceiveProps) {
    component.componentWillReceiveProps(props)
  }
  component.props = props
  updateComponent(component)
}

// 更新渲染前，判断执行componentWillUpdate及componentWillMount
export function beforeRenderComponent(component) {
  if (component.isMounted) {
    if (component.isReactComponent && component.componentWillUpdate) {
      component.componentWillUpdate()
    }
  } else {
    if (component.isReactComponent && component.componentWillMount) {
      component.componentWillMount()
    }
  }
}

// 渲染函数，若未挂载则返回节点内容提供挂载，否则更新目标被挂载节点内容
export function renderComponent(component) {
  let base
  const renderDom = component.render()
  base = diffNode(component.base, renderDom)

  // 完成渲染过程，将当前节点内容存储在component上
  //  base———————真实dom节点内容
  //  component——自定义类实例
  base._component = component
  component.base = base
  return component
}

// 更新渲染后，判断执行componentDidMount及componentDidUpdate
export function afterRenderComponent(component) {
  if (!component.isMounted) {
    if (component.isReactComponent && component.componentDidMount) {
      component.isMounted = true
      component.componentDidMount()
    }
  } else {
    if (component.isReactComponent && component.componentDidUpdate) {
      component.componentDidUpdate()
    }
  }
}

// 更新渲染component
export function updateComponent(component, changedState = {}) {
  beforeRenderComponent(component)
  Object.assign(component.state, changedState) // 注意Object.assign是会改变传入的第一个参数
  renderComponent(component)
  afterRenderComponent(component)
}

// 卸载component
export function unmountComponent(component) {
  if (component && component.componentWillUnmount) {
    component.componentWillUnmount()
  }

  if (component.base && component.base.parentNode) {
    component.base.parentNode.removeChild(component.base)
  }
  component.isMounted = false
  component = null
}

export default Component
