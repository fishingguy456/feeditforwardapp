import React, { Component } from 'react'
// import ReactDOM from 'react-dom'
import Scanner from './Scanner'
import Result from './Result'
import "./Scan.css";

class Scan extends Component {
    state = {
      scanning: false,
      results: [],
    }

    _scan = () => {
      this.setState({ scanning: !this.state.scanning })
    }
  
    _onDetected = result => {
      this.setState({ results: this.state.results.concat([result]) }, () => {
          if (this.props.onChange) {
              this.props.onChange(this.state);
          }
      })
    };
  
    render() {
      return (
        <div>
          <div>Scan item</div>
          <button onClick={this._scan}>
            {this.state.scanning ? 'Stop' : 'Start'}
          </button>
          {this.state.scanning ? <Scanner id="scanner" onDetected={this._onDetected} /> : null}
        </div>
      )
    }
  }

export default Scan;