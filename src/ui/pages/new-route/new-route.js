import React, { Component, PropTypes } from 'react';
import { AddRouteWithData } from '../../components/chapel/chapel.js'

export default class NewRoute extends Component {
  constructor(props, context) {
    super(props, context);

    this.addBench = this.addBench.bind(this);
    this.removeLastBench = this.removeLastBench.bind(this);

    this.state = {
      benches: [],
    }
  }
  addBench(e) {
    const benches = this.state.benches;
    benches.push(parseInt(e.target.dataset.count, 10));
    this.setState({ benches });
  }
  calculateHeight() {
    return 100 + this.state.benches.reduce((a, b) => (a + (b > 0 ? 30 : 10)), 0);
  }
  removeLastBench() {
    const benches = this.state.benches;
    benches.pop();
    this.setState({ benches });
  }
  render() {
    return (
      <div className="container">

        <div
          className="btn-toolbar mt-3 mr-auto ml-auto"
          role="toolbar"
          aria-label="Toolbar with button groups"
          style={{
            width: '300px',
          }}
        >
          <div className="btn-group mr-2" role="group" aria-label="First group">
            <button onClick={this.removeLastBench} type="button" className="btn btn-secondary">X</button>
          </div>
          <div className="btn-group mr-2" role="group" aria-label="Second group">
            <button onClick={this.addBench} type="button" className="btn btn-secondary" data-count="0">0</button>
            <button onClick={this.addBench} type="button" className="btn btn-secondary" data-count="1">1</button>
            <button onClick={this.addBench} type="button" className="btn btn-secondary" data-count="2">2</button>
            <button onClick={this.addBench} type="button" className="btn btn-secondary" data-count="3">3</button>
            <button onClick={this.addBench} type="button" className="btn btn-secondary" data-count="4">4</button>
          </div>
        </div>

        <AddRouteWithData
          {...this.props.params}
          chapelLayout={{
            version: 1,
            benches: this.state.benches,
            height: this.calculateHeight(),
          }}
          deacons={[]}
        />
      </div>
    );
  }
}

NewRoute.contextTypes = {

};
