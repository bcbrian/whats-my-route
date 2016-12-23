import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import shortid from 'shortid';
import Draggable from 'react-draggable';

export default class Chapel extends Component {
  constructor(props, context) {
    super(props, context);

    this.selectThisBench = this.selectThisBench.bind(this);
    this.addDeacon = this.addDeacon.bind(this);
    this.saveRoute = this.saveRoute.bind(this);
    this.incrementStep = this.incrementStep.bind(this);
    this.finalizeRoute = this.finalizeRoute.bind(this);
    this.addRouteSegment = this.addRouteSegment.bind(this);
    this.setDeacon = this.setDeacon.bind(this);
    this.selectSeatingBench = this.selectSeatingBench.bind(this);
    this.toggleSelectingSeat = this.toggleSelectingSeat.bind(this);
    this.toggleSettingRoute = this.toggleSettingRoute.bind(this);

    this.playRoute = this.playRoute.bind(this);

    // this.setDeaconSeat = this.setDeaconSeat.bind(this);
    this.state = {
      selectingSeat: false,
      settingRoute: false,
      deacons: props.deacons,
      routeIndex: 0,
      animationIndex: 0,
      step: 1,
      deaconId: '',
    };
  }
  setRouteIndex(routeIndex) {
    this.setState({ routeIndex });
  }
  selectThisBench({ target: { dataset: { selectedBench } } }) {
    this.setState({selectedBench});
  }
  toggleSelectingSeat() {
    this.setState({selectingSeat: !this.state.selectingSeat});
  }
  toggleSettingRoute() {
    this.setState({settingRoute: !this.state.settingRoute});
  }
  incrementStep(){
    let step = this.state.step;
    step ++;
    if(step > 3) step = 1;
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
  setDeaconSeat(deaconId, event) {
    if (this.state.deaconId !== deaconId) return;

    const deacons = this.state.deacons;
    const deacon = deacons.filter(d => d._id === deaconId)[0];
    const target = event.target;
    const parentRect = target.parentElement.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const offsetLeft = targetRect.left - parentRect.left - 2; //minus 2 for the border
    const offsetTop = targetRect.top - parentRect.top - 2;

    const left = offsetLeft;
    const top = offsetTop;
    if (this.state.selectingSeat){
      deacon.seat.left = left;
      deacon.seat.top = top;
    }

    if (this.state.settingRoute){
      this.recordDeconMovements(true, deaconId, event)
    }
    deacon.current.left = left;
    deacon.current.top = top;
    this.setState({ deacons });
  }
  setDeaconStart(deaconId,event){
    // Do some logic to figure out what whe should do
  }
  recordDeconMovements(override, deaconId, event, anotherThing) {
    if (!this.state.settingRoute) {
      if (!override){
        return;
      } else {
        console.log('HI override: ', override);
      }
    }
    if (this.state.deaconId !== deaconId) return;
    console.log('anotherThing: ', anotherThing);
    const deacons = this.state.deacons;
    const deacon = deacons.filter(d => d._id === deaconId)[0];
    const target = event.target;
    const parentRect = target.parentElement.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const offsetLeft = targetRect.left - parentRect.left - 2; //minus 2 for the border
    const offsetTop = targetRect.top - parentRect.top - 2;

    const left = offsetLeft;
    const top = offsetTop;

    deacon.seat.left = left;
    if (deacon.route.length === 0) {
      deacon.route.push([]);
    }
    deacon.route[deacon.route.length - 1].push({
      x: left,
      y: top,
    });

    this.setState({ deacons });
  }
  renderDeacons(){
    return this.state.deacons.reduce((allDeacons, deacon) => {
      const deaconPositions = [];
      //push in seat position
      //get seat bench position

      deaconPositions.push(
        (
          <Draggable
            key={`${deacon._id}:seat`}
            position={{
              x: deacon.current.left,
              y: deacon.current.top,
            }}
            onStop={this.setDeaconSeat.bind(this, deacon._id)}
            onStart={this.setDeaconStart.bind(this, deacon._id)}
            onDrag={this.recordDeconMovements.bind(this, false, deacon._id)}
          >
            <div

              className="deacon"
              ref={(ref) => {this[`${deacon._id}:seat`] = ref;}}
              style={{
                backgroundColor: deacon.color,
              }}
            />
          </Draggable>
        )
      );
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
  addDeacon() {
    const deacons = this.state.deacons;
    const deacon = {
      _id: shortid.generate(),
      color: this.getDeaconColor(deacons.length), // TODO: make list of safe colors :)
      seat: {
        top: 0,
        left: 0,
      },
      current: {
        top: 0,
        left: 0,
      },
      route: [],
    };
    deacons.push(deacon);
    this.setDeacon(deacon._id);
    this.toggleSelectingSeat();
    this.setState({ deacons });
    this.incrementStep();
  }
  saveRoute() {
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
  finalizeRoute() {
    this.toggleSettingRoute();
    this.setRouteIndex(0);
    this.setCurrentPositionToSeat();
    this.incrementStep();
  }
  addRouteSegment() {
    // Do some logic so that we have incremented what one we are saving
    const deacons = this.state.deacons;
    const deacon = deacons.filter(d => d._id === this.state.deaconId)[0];
    deacon.route.push([{
      x: deacon.current.left,
      y: deacon.current.top,
    }]);
    this.setRouteIndex(this.state.routeIndex + 1);
    this.setState({ deacons });

    this.setCurrentPositions(this.state.routeIndex + 1);
  }
  setCurrentPositions(index) {
    const deacons = this.state.deacons;
    console.log(`INDEX: ${index}`);
    deacons.forEach(deacon => {
      if (this.state.deaconId === deacon._id && (this.state.settingRoute || this.state.selectingSeat)) return;
      const currentRoute = deacon.route[index];
      const lastPositionInCurrentRoute = currentRoute[currentRoute.length - 1];
      deacon.current.left = lastPositionInCurrentRoute.x;
      deacon.current.top = lastPositionInCurrentRoute.y;
      console.log(`INDEX: ${index} DEACON: ${deacon._id} x:${Math.ceil(deacon.current.left)} y:${Math.ceil(deacon.current.top)}`);
    });
    this.setState({ deacons });
  }
  setCurrentPositionToSeat() {
    const deacons = this.state.deacons;
    deacons.forEach(deacon => {
      deacon.current.left = deacon.seat.left;
      deacon.current.top = deacon.seat.top;
    });
    this.setState({ deacons });
  }
  selectSeatingBench() {
    this.toggleSelectingSeat();
    this.toggleSettingRoute();
    this.setCurrentPositions(0);
    this.incrementStep();
  }
  playRoute() {
    const clearMe = setInterval(() => {
      let deacons = this.state.deacons;
      let routeIndex = this.state.routeIndex;
      let animationIndex = this.state.animationIndex;
      let maxNumberOfRoutes = 0;
      let maxNumberOfAnimations = 0;
      // console.log('ANIMATE: ', animationIndex);
      deacons.forEach(deacon => {
        // console.log('deacon: ', deacon._id);
        // console.log('deacon.route: ', deacon.route);
        const currentRoute = deacon.route[routeIndex];
        // console.log('currentRoute: ', currentRoute);
        const currentAnimation = currentRoute[animationIndex] ||
              currentRoute[currentRoute.length - 1];
        console.log('currentAnimation: ', currentAnimation);
        if (maxNumberOfRoutes < deacon.route.length){
          maxNumberOfRoutes = deacon.route.length;
        }
        if (maxNumberOfAnimations < currentRoute.length) {
          maxNumberOfAnimations = currentRoute.length;
        }
        deacon.current.left = currentAnimation.x;
        deacon.current.top = currentAnimation.y;
      });
      this.setState({
        deacons,
        routeIndex: animationIndex === maxNumberOfAnimations ? routeIndex + 1 : routeIndex,
        animationIndex: animationIndex + 1,
      });
      // console.log('maxNumberOfRoutes: ', maxNumberOfRoutes);
      // console.log('this.state.routeIndex: ', this.state.routeIndex);
      if ((maxNumberOfRoutes) === this.state.routeIndex) {
        clearInterval(clearMe);
        this.setState({
          deacons,
          routeIndex: 0,
          animationIndex: 0,
        });
        this.setCurrentPositionToSeat();
      }
    }, 50);
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
                <div className="form-group">
                  <label htmlFor="play">Play</label>
                  <button id="play" onClick={this.playRoute} className="btn btn-secondary btn-lg form-control form-control-lg" type="button">
                    play
                  </button>
                </div>
              </div>
            }
            { this.state.step !== 2 ? null :
              <div className="step stepTwo">
                <div className="form-group">
                  <label htmlFor="addDeacon">Drag the deacon to where he sits.</label>
                  <button id="addDeacon" onClick={this.selectSeatingBench} className="btn btn-secondary btn-lg form-control form-control-lg" type="button">
                    Next
                  </button>
                </div>
              </div>
            }
            { this.state.step !== 3 ? null :
              <div className="step stepThree">
                <div className="form-group">
                  <label htmlFor="sacramentToBishop">Now move the deacon to record a route.</label>
                  <button id="addSegment" data-pass-to-bishop={true} onClick={this.addRouteSegment} className="btn btn-secondary btn-lg form-control form-control-lg" type="button">
                    Add Segment (record)
                  </button>
                  <button id="finalizeRoute" data-pass-to-bishop={false} onClick={this.finalizeRoute} className="btn btn-secondary btn-lg form-control form-control-lg" type="button">
                    Filalize Route (save)
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
  deacons: PropTypes.array,
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
