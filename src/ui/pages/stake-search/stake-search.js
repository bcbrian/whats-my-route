import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Loader from '../../../../src/ui/components/loader/loader.js';
import AddStake from '../../../../src/ui/components/addStake/addStake.js';

class StakesSearch extends Component {
  constructor(props, context) {
    super(props, context);
  }

  renderListOfStakes(){
    return(
      <ul className="list-group">
        {
          this.props.stakes.map((stake) => {
            return (

              <li key={stake._id} className="list-group-item">
                <Link to={`/stake/${stake._id}`}>
                  <span className="tag tag-default tag-pill pull-xs-right">{stake.wardCount}</span>
                  {stake.name}
                </Link>
              </li>
            );
          })
        }

      </ul>
    );
  }



  render() {
    return this.props.loading ? (<Loader />) : (
      <div>
        <div className="jumbotron jumbotron-fluid wmr-jumbotron">
          <div className="container">
            {
              this.props.stakes.length > 0 ?
                <p className="text-xs-center">
                  When searching for "{this.props.searchString}" this is what we found.
                </p>
              :
                <p className="text-xs-center">
                  We did not find a stake mathcing your search.
                  <br />
                  Click here to search again or add a new stake below.
                </p>
            }
          </div>
        </div>
        <hr />
        <div className="container list">
          {
            this.props.stakes.length > 0 ?
            this.renderListOfStakes() :
            <AddStake searchString={this.props.searchString} />
          }

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
