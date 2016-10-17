import React, { Component, PropTypes } from 'react';

export default class Home extends Component {
  constructor(props, context) {
    super(props, context);
    this.search = this.search.bind(this);
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
            <div className="tray">
              <svg width="100%" height="100%" viewBox="0 0 962 684" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" xmlSpace="preserve" style={{fillRule: 'evenodd', clipRule: 'evenodd', strokeLinejoin: 'round', strokeMiterlimit: 1.41421 }}>
                  <g transform="matrix(1,0,0,1,-613.332,-1694)">
                      <g id="handle and tray" transform="matrix(0.707021,0,0,1,320.567,0)">
                          <path d="M1477.75,1694C1549.09,1694 1607,1751.91 1607,1823.25L1607,2081.75C1607,2153.09 1549.09,2211 1477.75,2211L729.25,2211C657.915,2211 600,2153.09 600,2081.75L600,1823.25C600,1751.91 657.914,1694 729.25,1694L1477.75,1694ZM1399.75,1784L799.25,1784C749.439,1784 699,1824.44 699,1874.25L699,2084.75C699,2134.56 749.44,2175 799.25,2175L1399.75,2175C1449.56,2175 1500,2134.56 1500,2084.75L1500,1874.25C1500,1824.44 1449.56,1784 1399.75,1784Z" style={{fill: "rgb(171, 171, 171)"}}/>
                          <g id="Tray">
                              <path d="M758.75,2378C610.975,2378 608.814,2373.88 586,2284.03L1601.33,2282.03C1578.52,2371.88 1577.36,2378 1429.58,2378L758.75,2378Z" style={{fill: "rgb(244,244,244)"}}/>
                              <path d="M1600.33,2286.03C1483.12,2288.03 698.228,2288.21 588,2286.03L505,2199.97C706.508,2198.82 1566.63,2200.54 1683.33,2199.97L1600.33,2286.03Z" style={{fill: "rgb(225, 225, 225)"}}/>
                              <path d="M1683.33,2199.97L505,2199.97C458.98,2177.32 339.23,2091.55 481.75,2115L1094.08,2112L1094.08,2112L1094.17,2112L1094.25,2112L1094.25,2112L1706.58,2115C1849.1,2091.55 1729.35,2177.32 1683.33,2199.97Z" style={{fill: "rgb(204, 204 ,204)"}}/>
                          </g>
                      </g>
                  </g>
              </svg>
            </div>
            <div className="input-group input-group-lg">
              <h2 className="display-5 text-xs-center"> What's My Route? </h2>
              <hr className="m-y-2" />
            </div>
            
            <div className="input-group input-group-lg">
              <input ref={(ref) => { this.searchString = ref; } } type="text" className="form-control" placeholder="What's your stake?" />
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