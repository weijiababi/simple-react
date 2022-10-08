import React from './react/index.js'
import ReactDOM from './react-dom'

class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 0,
      list: [1],
    }
  }

  add() {
    this.setState({
      count: this.state.count + 1,
    })
  }

  componentDidMount() {
    for (let i = 0; i < 100; i++) {
      this.setState((preState) => {
        return {
          count: preState.count + 1,
        }
      })
    }
  }

  render() {
    return (
      <div>
        <button onClick={() => this.add()}>click</button>
        <First name={this.state.count} />
      </div>
    )
  }
}

class First extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <div>{this.props.name}</div>
  }
}

ReactDOM.render(<Counter name="counter" />, document.querySelector('#root'))
