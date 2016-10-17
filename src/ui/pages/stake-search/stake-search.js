import React, { Component, PropTypes } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import _ from 'lodash';

import Loader from '../../../../src/ui/components/loader/loader.js';

export class StakesSearch extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return this.props.loading ? (<Loader />) : (
      <div>
        <div className="jumbotron jumbotron-fluid wmr-jumbotron">
          <div className="container">
            <p className="text-xs-center">When searching for "{this.props.searchString}" this is what we found.</p>
          </div>
        </div>
        <div className="container list">
          <ul className="list-group">
            {
              this.props.stakes.map((stake) => {
                return (
                  <li className="list-group-item">
                    <span className="tag tag-default tag-pill pull-xs-right">{stake.wardCount}</span>
                    {stake.name}
                  </li>
                );
              })
            }
            
          </ul>
        </div>
      </div>
    );
  }
}

StakesSearch.propTypes = {
  stakes: React.PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  searchString: React.PropTypes.string.isRequired,
  refetch: PropTypes.func,
};

const qStakes = gql`
  query qStakes(
    $searchString: String!,
  ) {
    stakes: searchStakes(
      searchString: $searchString,
    ) {
      _id
      name
      wardCount
    }
  }
`;

const StakesSearchData = graphql(qStakes, {

  options(props) {
    console.log('props.params: ', props.params)
    return {
      variables: {
        searchString: props.params.searchString,
      },
    };
  },

  // ownProps are the props that are passed into the `ProfileWithData`
  // when it is used by a parent component
  props: ({ ownProps, data: { loading, stakes, refetch } }) => ({
    ownProps,
    loading,
    stakes: stakes || [],
    searchString: ownProps.params.searchString,
    refetch,
  }),
})(StakesSearch);

export default StakesSearchData;