import React, { Component, PropTypes } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Chapel from '../../components/chapel/chapel.js'
import Loader from '../../../../src/ui/components/loader/loader.js';

class Route extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
     return this.props.loading ? (<Loader />) : (
      <div className="container">
        <Chapel
          {...this.props.params}
          chapelLayout={this.props.route.chapel}
          deacons={this.props.route.deacons}
        />
      </div>
    );
  }
}

Route.contextTypes = {

};

const qRoute = gql`
query qRoute(
    $stakeId: String!,
    $wardId: String!,
    $routeId: String!,
) {
  route: getRoute(
    stakeId: $stakeId,
    wardId: $wardId,
    routeId: $routeId,
  ) {
    _id
    chapel
    deacons {
      _id
      color
      seat {
        top
        left
      }
      current {
        top
        left
      }
      route {
        x
        y
      }
    }
  }
}
`;

const RouteData = graphql(qRoute, {

  options(props) {
    return {
      variables: {
        stakeId: props.params.stakeId,
        wardId: props.params.wardId,
        routeId: props.params.routeId,
      },
    };
  },

  // ownProps are the props that are passed into the `ProfileWithData`
  // when it is used by a parent component
  props: ({ ownProps, data: { loading, route, refetch } }) => ({
    ownProps,
    loading,
    route: route || {},
    stakeId: ownProps.params.stakeId,
    wardId: ownProps.params.wardId,
    routeId: ownProps.params.routeId,
    refetch,
  }),
})(Route);

export default RouteData;
