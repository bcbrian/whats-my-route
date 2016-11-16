import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Alert from 'react-s-alert';

class AddWard extends Component {
  constructor(props, context) {
    super(props, context);
    
    this.addWard = this.addWard.bind(this);
  }
  addWard(){
    const stakeId = this.props.stakeId;
    const wardName = this.wardName.value;
    // Alert.info(`The ward, ${wardName}, was added.`, {
    //   position: 'top',
    //   effect: 'scale',
    //   onShow() {
    //       console.log('aye!')
    //   },
    //   // beep: false,
    //   // timeout: 5000,
    //   // offset: 100,
    // });
    this.props.submit({ stakeId, wardName }).then(({ data }) => {
      console.log('got data', data);
      // this.context.router.push(`/stake/${data.submitWard._id}`);
      this.props.refetchStake();
      this.wardName.value = '';
      
    }).catch((error) => {
      console.log('there was an error sending the query', error);
    });
  }
  render(){
    return (
      <div className="container">
        <div className="form-group">
          <label htmlFor="wardName">Ward Name</label>
          <input id="wardName" ref={(ref) => { this.wardName = ref; } } type="text" className="form-control form-control-lg" />
        </div>
        <br />
        <div className="form-group">
          <button onClick={this.addWard} className="btn btn-secondary btn-lg form-control form-control-lg" type="button">
            Add Ward
          </button>
        </div>
      </div>
    );
  }
}

AddWard.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

AddWard.propTypes = {
  submit: PropTypes.func.isRequired,
  refetchStake: PropTypes.func.isRequired,
  stakeId: PropTypes.string.isRequired,
};

const mAddWard = gql`
  mutation mAddWard(
    $stakeId: String!
    $wardName: String!
  ) {
    submitWard(
      stakeId: $stakeId
      wardName: $wardName
    ) {
      _id
      name
    }
  }
`;

const AddWardWithData = graphql(mAddWard, {
  props: ({ mutate }) => ({
    submit: ({ stakeId, wardName }) => mutate({ variables: { stakeId, wardName } }),
  }),
})(AddWard);

export default AddWardWithData;

