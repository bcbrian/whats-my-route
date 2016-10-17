import React, { Component, PropTypes } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import _ from 'lodash';

import Loader from '../../../../src/ui/components/loader/loader.js';

export default class Stake extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return this.props.loading ? (<Loader />) : (
      <div>
        <div className="jumbotron jumbotron-fluid wmr-jumbotron">
          <div className="container">
            <h2 className="display-5 text-xs-center">North Rose Park Stake</h2>
            <p className="text-xs-center">Not what you where looking for? Click here to go back.</p>
          </div>
        </div>
        
        <div className="container list">
          <ul className="list-group">
            <li className="list-group-item">
              <span className="tag tag-default tag-pill pull-xs-right">2</span>
              1st ward
            </li>
            <li className="list-group-item">
              <span className="tag tag-default tag-pill pull-xs-right">1</span>
              6th ward
            </li>
            <li className="list-group-item">
              <i className="fa fa-plus" aria-hidden="true"></i> Add A Ward
            </li>
          </ul>
        </div>
      </div>

    );
  }
}

// Stake.propTypes = {
//   loading: PropTypes.bool.isRequired,
// };

