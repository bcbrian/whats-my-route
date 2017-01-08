import React, { Component, PropTypes } from 'react';

export default class Home extends Component {
  constructor(props, context) {
    super(props, context);
    this.search = this.search.bind(this);
    this.searchOnKeyUp = this.searchOnKeyUp.bind(this);
  }
  searchOnKeyUp(event) {
    event.preventDefault();
    if (event.keyCode !== 13) return;
    this.search(event);
  }
  search(event) {
    event.preventDefault();
    if (this.searchString.value === '') return;
    this.context.router.push(`/search/${this.searchString.value}`);
  }

  render() {
    return (
      <div className="jumbotron jumbotron-fluid wmr-jumbotron">
        <div className="container">
          <div className="container">
            <div className="video-container text-center">
              <iframe src="https://www.youtube.com/embed/T-235-wpQ58" frameborder="0" allowfullscreen></iframe>
            </div>
            <div className="text-center">
              <h2 className="display-5 text-center"> What's My Route? </h2>
              <hr className="m-y-2" />
            </div>

            <div className="input-group input-group-lg">
              <input onKeyUp={this.searchOnKeyUp} ref={(ref) => { this.searchString = ref; } } type="text" className="form-control" placeholder="What's your stake?" />
              <span className="input-group-btn">
                <button onClick={this.search} className="btn btn-secondary" type="button">
                  <i className="fa fa-search" aria-hidden="true"></i>
                </button>
              </span>

            </div>
            <p className="form-text text-muted">First lets search for the stake you are in. If we do not have it you will get to add it.</p>
          </div>
        </div>
      </div>
    );
  }
}

Home.contextTypes = {
  router: React.PropTypes.object.isRequired,
};
