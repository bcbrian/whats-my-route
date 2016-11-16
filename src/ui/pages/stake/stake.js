import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Loader from '../../../../src/ui/components/loader/loader.js';
import AddWard from '../../../../src/ui/components/addWard/addWard.js';

class Stake extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return this.props.loading ? (<Loader />) : (
      <div>
        <div className="jumbotron jumbotron-fluid wmr-jumbotron">
          <div className="container">
            <h2 className="display-5 text-xs-center">{this.props.stake.name}</h2>
            <p className="text-xs-center">Not what you where looking for? Click here to go back.</p>
          </div>
        </div>
        
        <div className="container list">
          <ul className="list-group">
            {!this.props.stake.wards ? null : this.props.stake.wards.map((ward) => {
              return (
                <li key={ward._id} className="list-group-item">
                  <Link to={`/stake/${this.props.stakeId}/ward/${ward._id}`}>
                    <span className="tag tag-default tag-pill pull-xs-right">{ ward.routeCount }</span>
                    { ward.name }
                  </Link>
                </li>
              );
            })}
          </ul>
          <hr />
          <AddWard refetchStake={this.props.refetch} stakeId={this.props.stake._id}/>
        </div>
        
      </div>

    );
  }
}


Stake.propTypes = {
  stake: React.PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  stakeId: React.PropTypes.string.isRequired,
  refetch: PropTypes.func,
};

const qStake = gql`
  query qStake(
    $stakeId: String!,
  ) {
    stake: getStake(
      stakeId: $stakeId,
    ) {
      _id
      name
      wards{
        _id
        name
        routeCount
      }
    }
  }
`;

const StakeData = graphql(qStake, {

  options(props) {
    return {
      variables: {
        stakeId: props.params.stakeId,
      },
    };
  },

  // ownProps are the props that are passed into the `ProfileWithData`
  // when it is used by a parent component
  props: ({ ownProps, data: { loading, stake, refetch } }) => ({
    ownProps,
    loading,
    stake: stake || {},
    stakeId: ownProps.params.stakeId,
    refetch,
  }),
})(Stake);

export default StakeData;

