import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import shortid from 'shortid';

export default class Chapel extends Component {
  constructor(props, context) {
    super(props, context);
    
    console.log(props);
    
    this.selectThisBench = this.selectThisBench.bind(this);
    this.addDeacon = this.addDeacon.bind(this);
    this.saveRoute = this.saveRoute.bind(this);
    this.incrementStep = this.incrementStep.bind(this);
    this.setDeacon = this.setDeacon.bind(this);
    this.selectSeatingBench = this.selectSeatingBench.bind(this);
    this.passToBishop = this.passToBishop.bind(this);
    this.selectFirstBech = this.selectFirstBech.bind(this);
    this.setPassDirection = this.setPassDirection.bind(this);
    this.toggleSelectSeat = this.toggleSelectSeat.bind(this);
    this.toggleSelectRoute = this.toggleSelectRoute.bind(this);
    this.state = {
      selectedBench: '0:0:0',
      selectSeat: false,
      selectRoute: false,
      deacons: props.deacons,
      step: 1,
      deaconId: '',
    };
  }
  selectThisBench({target:{dataset:{selectedBench}}}){
    this.setState({selectedBench});
  }
  toggleSelectSeat(){
    this.setState({selectSeat: !this.state.selectSeat});
  }
  toggleSelectRoute(){
    this.setState({selectRoute: !this.state.selectRoute});
  }
  incrementStep(){
    let step = this.state.step;
    step ++;
    if(step > 5) step = 1;
    this.setState({step});
  };
  setDeacon(deaconId){
    this.setState({deaconId});
  }
  renderBench({
    position,
    top,
    left,
    right,
  }){
    return(
      <div 
        onClick={this.selectThisBench}
        key={position}
        ref={(ref) => {this[position] = ref;}}
        data-selected-bench={`${position}`}
        className="bench"
        style={{
          top,
          left,
          right,
        }}
      >
        <div data-selected-bench={`${position}`} className="benchEnd benchEndLeft"></div>
        <div data-selected-bench={`${position}`} className="benchBack"></div>
        <div data-selected-bench={`${position}`} className="benchSeat"></div>
        <div data-selected-bench={`${position}`} className="benchEnd benchEndRight"></div>
        {
          this.state.selectSeat ?
            <div data-selected-bench={`${position}`} className="benchTarget"></div>
          : 
            this.state.selectRoute ?
              <div>
                <div data-selected-bench={`${position}:right`} className="benchTarget benchRight"></div>
                <div data-selected-bench={`${position}:left`} className="benchTarget benchLeft"></div>
              </div>
            :
              null
        }
        {
          this.state.selectSeat ?
            this.state.selectedBench !== `${position}` ? null :
            <div className="benchHightlight"></div>
          : 
            this.state.selectRoute ?
              <div>
                {
                  this.state.selectedBench !== `${position}:right` ? null :
                  <div className="benchHightlight benchRight"></div>
                }
                {
                  this.state.selectedBench !== `${position}:left` ? null :
                  <div className="benchHightlight benchLeft"></div>
                }
              </div>
            :
              null
        }
        
      </div>
    );
  }
  
  benchPrep({ position, top, left, width, rows }){
    let totalWidth = 300;
    if(rows === 0){
      return[null];
    }
    const benches = [];
    for(var i = 0; i < rows; i++){
      benches.push(
        this.renderBench({
          position: `${position}:${i}`,
          top: `${top + 30*i}px`,
          left: `${left}px`,
          right: `${totalWidth - width - left}px`,
        })
      );
    }
    return benches;
  }
  
  renderBenches(sections){
    //default render top left bench
    let space = 100;
    let renderedBenches = sections.reduce((benches, section, index)=>{
      let totalWidth = 300;
      let left = 0;
      let width = 75;
      let top = 100;
      let sectionHeight = 90;
      let rows = [1, 1, 1, 1, 1, 1];
    
      let loopCount = section === 0 ? 1 : section;
      width = (totalWidth - (20 * (section - 1) ) ) / loopCount;
      
      for(var i = 0; i < loopCount; i++){
        
        let sectionOfBenches = this.benchPrep({
          position: `${index}:${i}`,
          top: space,
          left: left+((width + 20) * i),
          width,
          rows: section === 0 ? 0 : 3,
        });
        
        benches = [].concat(benches, sectionOfBenches);
      }
      space += section === 0 ? 30 : 90;
      return benches;
    },[]);
    return renderedBenches;
  }
  getBenches(){
    return(
      <div>
        {this.renderBenches(this.props.chapelLayout)}
      </div>
    );
  }

  renderDeacons(){
    // <div className="deacon"></div>
    // <div className="deacon route routeDown"></div>
    // <div className="deacon route routeUp"></div>
    return this.state.deacons.reduce((allDeacons, deacon) => {
      let deaconPositions = [];
      //push in seat position
      //get seat bench position
      
      deaconPositions.push(
        (
          <div key={`${deacon._id}:seat`}className="deacon" style={{
            left: `${deacon.seat.left}px`,
            top: `${deacon.seat.top}px`,
            backgroundColor: deacon.color,
          }}></div>
        )
      );
      //push in pass to bishop position
      if(deacon.passToBishop){
        
        deaconPositions.push(
          (
            <div key={`${deacon._id}:bishop`}className="deacon" style={{
              left: `${deacon.bishop.left }px`,
              top: `${deacon.bishop.top }px`,
              backgroundColor: deacon.color,
            }}></div>
          )
        );
      }
      // push in route position
      // "0:1:0:right"
      if(deacon.route.bench){
        
        deaconPositions.push(
          (
            <div key={`${deacon._id}:route`}className={`deacon route ${deacon.route.direction ? 'route'+deacon.route.direction : ''}`} style={{
              left: `${deacon.route.left}px`,
              top: `${deacon.route.top}px`,
              backgroundColor: deacon.color,
            }}></div>
          )
        );
      }
      return [].concat(allDeacons, deaconPositions);
    }, []);
  }
  getDeaconColor(number){
    if(number > 16) number = Math.ceil(Math.random()*16);
    return [
      '#ff0000',
      '#ffc145',
      '#61bd33',
      '#45ffff',
      '#3f00bd',
      
      '#bd0000',
      '#ffff00',
      '#00ff00',
      '#45c1ff',
      '#ff00ff',

      '#bd6133',
      '#bdbd00',
      '#00ffaa',
      '#4583ff',
      '#ff00aa',
      '#bd3361',
    ][number];
  }
  addDeacon(){
    const deacons = this.state.deacons;
    const deacon = {
      _id:shortid.generate(),
      color:this.getDeaconColor(deacons.length), // TODO: make list of safe colors :) 
      passToBishop:false,
      seat:{
        bench: '',
        top: 0,
        left: 0,
        position: null,
      },
      route:{
        bench: '',
        top: 0,
        left: 0,
        direction: '',
      },
      bishop:{
        top: null,
        left: null,
      },
    }
    deacons.push(deacon);
    this.setDeacon(deacon._id);
    this.toggleSelectSeat();
    this.setState({deacons});
    this.incrementStep();
  }
  saveRoute(){
    const stakeId = this.props.stakeId;
    const wardId = this.props.wardId;
    const chapel = this.props.chapelLayout;
    const deacons = this.state.deacons;
    console.log(stakeId, wardId, chapel, deacons);
    this.props.submit({
      stakeId,
      wardId,
      chapel,
      deacons,
    }).then(({ data }) => {
      this.context.router.push(`/stake/${this.props.stakeId}/ward/${wardId}/route/${data.submitRoute._id}`);
    }).catch((error) => {
      console.log('there was an error sending the query', error);
    });
  }
  selectSeatingBench(){
    this.toggleSelectSeat();
    const deacons = this.state.deacons;
    const deacon = deacons.filter( d => d._id === this.state.deaconId)[0];
    deacon.seat.bench = this.state.selectedBench;
    
    const seatBench = this[deacon.seat.bench];
    
    const deaconsSittingHere = deacons.filter( d => d.seat.bench === deacon.seat.bench);
    let currentSeatPosition = Math.max(...deaconsSittingHere.map( d => d.seat.position));
    deacon.seat.position = (currentSeatPosition || currentSeatPosition === 0) ? currentSeatPosition + 1 : 0;
 
    let top = 0;
    let left = 0;
    if(seatBench){
      top = seatBench.offsetTop;
      left = seatBench.offsetLeft;
    }
    
    deacon.seat.top = top + 2;
    deacon.seat.left = left + 1 + (11 * (deacon.seat.position - 1));
    
    this.setState({deacons});
    this.incrementStep();
  }
  passToBishop({target:{dataset:{passToBishop}}}){
    const deacons = this.state.deacons;
    const deacon = deacons.filter( d => d._id === this.state.deaconId)[0];
    deacon.passToBishop = passToBishop === 'true';
    if(deacon.passToBishop){
      const bishopChair = this.bishopChair;
      let top = 0;
      let left = 0;
      if(bishopChair){
        top = bishopChair.offsetTop + 20;
        left = bishopChair.offsetLeft + bishopChair.offsetParent.offsetLeft - 15;
      }
      deacon.bishop.top = top;
      deacon.bishop.left = left;
    }
    
    this.toggleSelectRoute();
    this.setState({deacons});
    this.incrementStep();
  }
  selectFirstBech(){
    this.toggleSelectRoute();
    const deacons = this.state.deacons;
    const deacon = deacons.filter( d => d._id === this.state.deaconId)[0];
    deacon.route.bench = this.state.selectedBench
    
    let routeBenchId = deacon.route.bench;
    let routeBench;
    let top = 0;
    let left = 0;
    let side = 'right';
    if(routeBenchId.includes(':right')){
      routeBenchId = routeBenchId.replace(/:right/i, '');
      routeBench = this[routeBenchId];
      top = routeBench.offsetTop + 2;
      left = routeBench.offsetLeft+routeBench.offsetWidth;
    } else {
      side = 'left';
      routeBenchId = routeBenchId.replace(/:left/i, '');
      routeBench = this[routeBenchId];
      top = routeBench.offsetTop + 2;
      left = routeBench.offsetLeft - 10;
    }
    
    deacon.route.top = top;
    deacon.route.left = left;
    
    this.setState({deacons});
    this.incrementStep();
  }
  
  setPassDirection({target:{dataset:{passDirection}}}){
    const deacons = this.state.deacons;
    const deacon = deacons.filter( d => d._id === this.state.deaconId)[0];
    deacon.route.direction = passDirection;
    this.setState({deacons});
    this.incrementStep();
  }
  render(){
    return (
      <div className="">

        <div className="chapel" style = {{
          transform: `scale(${this.props.scale || 1})`,
        }}>
          <div className="stand">
            <div className="centerSection">
              <div className="podium"></div>
              <div ref={(ref) => {this.bishopChair = ref;}} className="chair chairOne"></div>
              <div className="chair chairTwo"></div>
              <div className="chair chairThree"></div>
            </div>
            <div className="sacramentTable sacramentTableLeft"></div>
            <div className="sacramentTable sacramentTableRight"></div>
          </div>
          {this.getBenches()}
          {this.renderDeacons()}
        </div>
        {this.props.routeId ? null : 
          <div className="interact">
            { this.state.step !== 1 ? null :
              <div className="step stepOne">
                <div className="form-group">
                  <label htmlFor="addDeacon">Click to add another deacon.</label>
                  <button id="addDeacon" onClick={this.addDeacon} className="btn btn-secondary btn-lg form-control form-control-lg" type="button">
                    Add a Deacon
                  </button>
                </div>
                <div className="form-group">
                  <label htmlFor="addDeacon">Click save the route.</label>
                  <button id="addDeacon" onClick={this.saveRoute} className="btn btn-secondary btn-lg form-control form-control-lg" type="button">
                    Save Route
                  </button>
                </div>
              </div>
            }
            { this.state.step !== 2 ? null :
              <div className="step stepTwo">
                <div className="form-group">
                  <label htmlFor="addDeacon">Select the bench he sits on.</label>
                  <button id="addDeacon" onClick={this.selectSeatingBench} className="btn btn-secondary btn-lg form-control form-control-lg" type="button">
                    Next
                  </button>
                </div>
              </div>
            }
            { this.state.step !== 3 ? null :
              <div className="step stepThree">
                <div className="form-group">
                  <label htmlFor="sacramentToBishop">Passes Sacrament to the Bishop?</label>
                  <button id="sacramentToBishop" data-pass-to-bishop={true} onClick={this.passToBishop} className="btn btn-secondary btn-lg form-control form-control-lg" type="button">
                    Yes
                  </button>
                  <button id="sacramentToBishop" data-pass-to-bishop={false} onClick={this.passToBishop} className="btn btn-secondary btn-lg form-control form-control-lg" type="button">
                    No
                  </button>
                </div>
              </div>
            }
            { this.state.step !== 4 ? null :
              <div className="step stepFour">
                <div className="form-group">
                  <label htmlFor="addDeacon">Select the bench he passes sacrament to first.</label>
                  <button id="addDeacon" onClick={this.selectFirstBech} className="btn btn-secondary btn-lg form-control form-control-lg" type="button">
                    Next
                  </button>
                </div>
              </div>
            }
            { this.state.step !== 5 ? null :
              <div className="step stepFive">
                <div className="form-group">
                  <label htmlFor="sacramentToBishop">Moves up or down?</label>
                  <button id="sacramentToBishop" data-pass-direction={'Up'} onClick={this.setPassDirection} className="btn btn-secondary btn-lg form-control form-control-lg" type="button">
                    Up
                  </button>
                  <button id="sacramentToBishop" data-pass-direction={'Down'} onClick={this.setPassDirection} className="btn btn-secondary btn-lg form-control form-control-lg" type="button">
                    Down
                  </button>
                </div>
              </div>
            }
          </div>
        }
      </div>
    );
  }
}

Chapel.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

Chapel.propTypes = {
  chapelLayout: PropTypes.array,
};


const mAddRoute = gql`
  mutation mAddRoute(
    $stakeId: String!
    $wardId: String!
    $chapel: [Int]
    $deacons: [DeaconInput]
  ) {
    submitRoute(
      stakeId: $stakeId
      wardId: $wardId
      chapel: $chapel
      deacons: $deacons
    ) {
      _id
    }
  }
`;

const AddRouteWithData = graphql(mAddRoute, {
  props: ({ mutate }) => ({
    submit: ({ stakeId, wardId, chapel, deacons }) => mutate({ variables: { stakeId, wardId, chapel, deacons } }),
  }),
})(Chapel);

export { AddRouteWithData };



