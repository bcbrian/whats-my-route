import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


import Loader from '../../../../src/ui/components/loader/loader.js';
import AddStake from '../../../../src/ui/components/addStake/addStake.js';

class StakesSearch extends Component {
  constructor(props, context) {
    super(props, context);

    this.toggleAddStake = this.toggleAddStake.bind(this);

    this.state = {
      addStake: false,
    };
  }

  toggleAddStake() {
    console.log('toggling state :P: ', this.state.addStake);
    this.setState({ addStake: !this.state.addStake });
  }

  renderListOfStakes() {
    return (
      <ul className="list-group">
        {
          this.props.stakes.map((stake) => {
            return (
              <Link key={stake._id} to={`/stake/${stake._id}`}>
                <li className="list-group-item">
                  {stake.name}
                  <span className="badge badge-default pull-right">{stake.wardCount}</span>
                </li>
              </Link>
            );
          })
        }

      </ul>
    );
  }



  render() {
    return this.props.loading ? (<Loader />) : (
      <div>
        <div className="container">
          <div className="container">
            {
              this.props.stakes.length > 0 ?
                <div>
                  <h2 className="display-5 text-left mt-2">Results</h2>
                  <i className="fa fa-plus-square fa-3x far-right-no-top" onClick={this.toggleAddStake} aria-hidden="true" />
                </div>
              :
              <p className="text-center">
                We did not find a stake matching your search.
                <br />
                Click <Link to={'/'}> here </Link> to search again or add a new stake below.
              </p>
            }
          </div>
        </div>
        <hr />
        <div className="container list">
          {
            this.props.stakes.length < 1 || this.state.addStake ?
              <ReactCSSTransitionGroup
                component="div"
                transitionName={{
                  enter: 'animated',
                  enterActive: 'fadeInDown',
                  leave: 'animated',
                  leaveActive: 'fadeOutUp',
                  appear: 'animated',
                  appearActive: 'fadeInDown',
                }}
                transitionEnterTimeout={1000}
                transitionLeaveTimeout={1000}
              >
                <AddStake searchString={this.props.searchString} />
              </ReactCSSTransitionGroup>

            : null
          }
          {
            this.props.stakes.length > 0 ?
            this.renderListOfStakes() :
            null
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
