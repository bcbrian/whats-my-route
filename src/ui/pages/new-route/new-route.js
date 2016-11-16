import React, { Component, PropTypes } from 'react';
import { AddRouteWithData } from '../../components/chapel/chapel.js'

export default class NewRoute extends Component {
  constructor(props, context) {
    super(props, context);
  }
  
  render() {
    return (
      <div className="container">
        <AddRouteWithData {...this.props.params} chapelLayout={[ 3, 3, 0, 3]} deacons={[]}/>
      </div>
    );
  }
}

NewRoute.contextTypes = {

};