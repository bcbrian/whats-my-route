import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class AddStake extends Component {
  constructor(props, context) {
    super(props, context);

    this.addStake = this.addStake.bind(this);
  }
  addStake(){
    const stakeName = this.stakeName.value;
    const wardName = this.wardName.value;
    this.props.submit({ stakeName, wardName }).then(({ data }) => {
      alertify.logPosition('top right').success('Stake and Ward added');
      this.context.router.push(`/stake/${data.submitStake._id}`);
    }).catch((error) => {
      console.log('there was an error sending the query', error);
    });
  }
  render(){
    return (
      <div className="container">
        <div className="form-group">
          <label htmlFor="stakeName">Stake Name</label>
          <input id="stakeName" ref={(ref) => { this.stakeName = ref; } } type="text" className="form-control form-control-lg" defaultValue={this.props.searchString} />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="wardName">Ward Name</label>
          <input id="wardName" ref={(ref) => { this.wardName = ref; } } type="text" className="form-control form-control-lg" />
        </div>
        <br />
        <div className="form-group">
          <button onClick={this.addStake} className="btn btn-secondary btn-lg form-control form-control-lg" type="button">
            Add Stake and Ward
          </button>
        </div>
      </div>
    );
  }
}

AddStake.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

AddStake.propTypes = {
  submit: PropTypes.func.isRequired,
  searchString: PropTypes.string.isRequired,
};

const mAddStake = gql`
  mutation mAddStake(
    $stakeName: String!
    $wardName: String!
  ) {
    submitStake(
      stakeName: $stakeName
      wardName: $wardName
    ) {
      _id
      name
    }
  }
`;

const AddStakeWithData = graphql(mAddStake, {
  props: ({ mutate }) => ({
    submit: ({ stakeName, wardName }) => mutate({ variables: { stakeName, wardName } }),
  }),
})(AddStake);

export default AddStakeWithData;
