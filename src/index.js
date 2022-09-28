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
        <span>{this.state.count}</span>
        <button onClick={() => this.add()}>click</button>
      </div>
    )
  }
}

ReactDOM.render(<Counter name="counter" />, document.querySelector('#root'))
