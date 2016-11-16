import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Loader from '../../../../src/ui/components/loader/loader.js';
import Chapel from '../../components/chapel/chapel.js'

class Ward extends Component {
  constructor(props, context) {
    super(props, context);
    this.addRoute = this.addRoute.bind(this);
  }
  
  addRoute(event) {
    event.preventDefault();
    this.context.router.push(`/stake/${this.props.stakeId}/ward/${this.props.wardId}/new-route`);
  }
  
  render() {
    return this.props.loading ? (<Loader />) : (
      <div>
        <div className="jumbotron jumbotron-fluid wmr-jumbotron">
          <div className="container">
            <h2 className="display-5 text-xs-center">{this.props.ward.name}</h2>
            <h5 className="display-5 text-xs-center">{this.props.stake.name}</h5>
          </div>
        </div>
        
        <div className="container list">
          <div className="">
            {!this.props.ward.routes ? null : this.props.ward.routes.map((route) => {
              return (
                <div key={route._id}  style={{
                  transform: 'scale(0.5)',
                  height: '200px',
                  transformOrigin: '50% 0',
                  backgroundColor: '#00e9a8',
                }}>
                  <Link to={`/stake/${this.props.stakeId}/ward/${this.props.wardId}/route/${route._id}`}>
                    <Chapel
                      chapelLayout={route.chapel}
                      deacons={route.deacons}
                      routeId={route._id}
                    />
                  </Link>
                </div>
              );
            })}
          </div>
          <hr />
          <div className="form-group">
            <button onClick={this.addRoute} className="btn btn-secondary btn-lg form-control form-control-lg" type="button">
              Add a Route
            </button>
          </div>
        </div>
        
      </div>

    );
  }
}


Ward.propTypes = {
  stake: React.PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  stakeId: React.PropTypes.string.isRequired,
  refetch: PropTypes.func,
};

Ward.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

const qStake = gql`
  query qStake(
    $stakeId: String!,
    $wardId: String!,
  ) {
    stake: getStake(
      stakeId: $stakeId,
    ) {
      _id
      name
    }
    ward: getWard(
      stakeId: $stakeId,
      wardId: $wardId,
    ) {
      _id
      name
      routes {
        _id
        chapel
        deacons {
          _id
          color
          passToBishop
          seat {
            bench
            position
            top
            left
          }
          route {
            bench
            direction
            top
            left
          }
          bishop {
            top
            left
          }
        }
      }
    }
  }
`;

const WardData = graphql(qStake, {

  options(props) {
    return {
      variables: {
        stakeId: props.params.stakeId,
        wardId: props.params.wardId,
      },
    };
  },

  // ownProps are the props that are passed into the `ProfileWithData`
  // when it is used by a parent component
  props: ({ ownProps, data: { loading, stake, ward, refetch } }) => ({
    ownProps,
    loading,
    stake: stake || {},
    ward: ward || {},
    stakeId: ownProps.params.stakeId,
    wardId: ownProps.params.wardId,
    refetch,
  }),
})(Ward);

export default WardData;

