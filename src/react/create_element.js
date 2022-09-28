class Element {
  constructor(tag, attrs, children = [], key = null) {
    this.tag = tag
    this.attrs = attrs
    this.children = children
    this.key = key
  }
}

function createElement(tag, attrs, ...children) {
  attrs = attrs || {}
  return new Element(tag, attrs, children, attrs.key)
}

export default createElement
