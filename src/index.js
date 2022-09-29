import React from './react/index.js'
import ReactDOM from './react-dom'

class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 0,
    }
  }

  add() {
    this.setState({
      count: this.state.count + 1,
    })
  }

  render() {
    return (
      <div>
        <button onClick={() => this.add()}>click</button>
        <Third name={this.state.count} />
      </div>
    )
  }
}

class First extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <div>first</div>
  }
}
class Second extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <div>second</div>
  }
}

function Third(props) {
  return <div>{props.name}</div>
}

function Fourth() {
  return <div>fourth</div>
}

ReactDOM.render(<Counter name="counter" />, document.querySelector('#root'))
