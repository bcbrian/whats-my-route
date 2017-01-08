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
    this.editDeacon = this.editDeacon.bind(this);
    this.saveRoute = this.saveRoute.bind(this);
    this.incrementStep = this.incrementStep.bind(this);
    this.finalizeRoute = this.finalizeRoute.bind(this);
    this.addRouteSegment = this.addRouteSegment.bind(this);
    this.previousSegment = this.previousSegment.bind(this);
    this.setDeacon = this.setDeacon.bind(this);
    this.selectSeatingBench = this.selectSeatingBench.bind(this);
    this.toggleSelectingSeat = this.toggleSelectingSeat.bind(this);
    this.toggleSettingRoute = this.toggleSettingRoute.bind(this);

    this.playRoute = this.playRoute.bind(this);
    this.resetCurrentSegment = this.resetCurrentSegment.bind(this);
    this.playSegment = this.playSegment.bind(this);

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
  incrementStep(nextStep) {
    if (nextStep) return this.setState({ step: nextStep });
    let step = this.state.step;
    step++;
    if (step > 3) step = 1;
    return this.setState({ step });
  }
  setDeacon(deaconId) {
    this.setState({ deaconId });
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

  renderBenches(sections) {
    // default render top left bench
    let space = 100;
    const renderedBenches = sections.reduce((benches, section, index) => {
      const totalWidth = 300;
      const left = 0;
      let width = 75;

      const loopCount = section === 0 ? 1 : section;
      width = (totalWidth - (20 * (section - 1) ) ) / loopCount;

      for(var i = 0; i < loopCount; i++){

        let sectionOfBenches = this.benchPrep({
          position: `${index}:${i}`,
          top: space,
          left: left+((width + 20) * i),
          width,
          rows: section === 0 ? 0 : 1,
        });

        benches = [].concat(benches, sectionOfBenches);
      }
      space += section === 0 ? 10 : 30;
      return benches;
    },[]);
    return renderedBenches;
  }
  getBenches() {
    return (
      <div>
        {this.renderBenches(this.props.chapelLayout.benches)}
      </div>
    );
  }
  setDeaconSeat(deaconId, event) {
    if ((!this.state.settingRoute && !this.state.selectingSeat) || this.state.deaconId !== deaconId){
      if (!this.state.settingRoute && !this.state.selectingSeat) {
        // set the deacons id so we can edit this one
        this.setDeacon(deaconId);
      }
      return;
    }

    const deacons = this.state.deacons;
    const deacon = deacons.filter(d => d._id === deaconId)[0];
    const target = event.target;
    const parentRect = target.parentElement.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const offsetLeft = targetRect.left - parentRect.left - 2; // minus 2 for the border
    const offsetTop = targetRect.top - parentRect.top - 2;

    const left = offsetLeft;
    const top = offsetTop;
    if (this.state.selectingSeat) {
      deacon.seat.left = left;
      deacon.seat.top = top;
    }

    if (this.state.settingRoute) {
      this.recordDeconMovements(true, deaconId, event)
    }
    deacon.current.left = left;
    deacon.current.top = top;
    this.setState({ deacons });
  }
  setDeaconStart(deaconId, event) {
    // Do some logic to figure out what whe should do
  }
  recordDeconMovements(override, deaconId, event, deltas) {
    // TODO: this could use some clean up :P
    if (!this.state.settingRoute) {
      if (!override) {
        return;
      } else {
        console.log('HI override: ', override);
      }
    }
    if (this.state.deaconId !== deaconId) return;
    // console.log('deltas: ', deltas);
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
    const deaconRoutes = deacon.route;
    if (!deaconRoutes[this.state.routeIndex]) deaconRoutes[this.state.routeIndex] = [];
    const recordingSegment = deaconRoutes[this.state.routeIndex];
    const lastPosition = recordingSegment[recordingSegment.length - 1];
    if (!lastPosition) {
      recordingSegment.push({
        x: left,
        y: top,
      });
    } else if (deltas) {
      recordingSegment.push({
        x: lastPosition.x + deltas.deltaX,
        y: lastPosition.y + deltas.deltaY,
      });
    }

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
              className={`deacon animated bounceIn ${deacon._id === this.state.deaconId ? 'deacon-helper' : ''}`}
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
    const newIndex = this.state.routeIndex + 1;
    const deacons = this.state.deacons;
    const deacon = deacons.filter(d => d._id === this.state.deaconId)[0];
    console.log('deacon.route[newIndex]: ', deacon.route[newIndex]);
    if (!deacon.route[newIndex]) {
      deacon.route[newIndex] = [{
        x: deacon.current.left,
        y: deacon.current.top,
      }];
      this.setState({ deacons });
    }
    this.setRouteIndex(newIndex);
    this.setCurrentPositions(newIndex);
  }
  previousSegment() {
    const newIndex = this.state.routeIndex - 1 < 0? 0 : this.state.routeIndex - 1;
    this.setRouteIndex(newIndex);
    this.setCurrentPositions(newIndex);
  }
  setCurrentPositions(index) {
    const deacons = this.state.deacons;
    console.log(`INDEX: ${index}`);
    deacons.forEach(deacon => {
      try{
        if (this.state.deaconId === deacon._id && (this.state.settingRoute || this.state.selectingSeat)) return;
        const currentRoute = deacon.route[index];
        const lastPositionInCurrentRoute = currentRoute[currentRoute.length - 1];
        deacon.current.left = lastPositionInCurrentRoute.x;
        deacon.current.top = lastPositionInCurrentRoute.y;
        console.log(`INDEX: ${index} DEACON: ${deacon._id} x:${Math.ceil(deacon.current.left)} y:${Math.ceil(deacon.current.top)}`);
      } catch (error) {
        console.warn('Could not set current position', deacon, error)
      }
    });
    this.setState({ deacons });
  }
  resetCurrentSegment() {
    console.log('RESETING');
    const deacons = this.state.deacons;
    const deacon = deacons.filter(d => d._id === this.state.deaconId)[0];

    const deaconRoutes = deacon.route;
    const currentSegment = deaconRoutes[this.state.routeIndex];
    const previousSegment = deaconRoutes[this.state.routeIndex - 1];
    if(previousSegment){
      deaconRoutes[this.state.routeIndex] = [previousSegment[previousSegment.length - 1]];
    } else {
      deaconRoutes[this.state.routeIndex] = [{
        x: deacon.seat.left,
        y: deacon.seat.top,
      }];
    }


    deacon.current.left = deaconRoutes[this.state.routeIndex][0].x;
    deacon.current.top = deaconRoutes[this.state.routeIndex][0].y;

    this.setState({ deacons });
  }
  setCurrentPositionToSeat() {
    console.log('SETTING SEATS');
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
  editDeacon(){
    this.incrementStep(3);
    this.toggleSettingRoute();
  }
  playRoute() {
    const clearMe = setInterval(() => {
      let deacons = this.state.deacons;
      let routeIndex = this.state.routeIndex;
      let animationIndex = this.state.animationIndex;
      let maxNumberOfRoutes = 0;
      let maxNumberOfAnimations = 0;
      // console.log('routeIndex: ', routeIndex);
      // console.log('ANIMATE: ', animationIndex);
      deacons.forEach(deacon => {
        try{
          // console.log('deacon: ', deacon._id);
          // console.log('deacon.route: ', deacon.route);
          const currentRoute = deacon.route[routeIndex];
          // console.log('currentRoute: ', currentRoute);
          const currentAnimation = currentRoute[animationIndex] ||
                currentRoute[currentRoute.length - 1];
          // console.log('currentAnimation: ', currentAnimation);
          if (maxNumberOfRoutes < deacon.route.length){
            maxNumberOfRoutes = deacon.route.length;
          }
          if (maxNumberOfAnimations < currentRoute.length) {
            maxNumberOfAnimations = currentRoute.length;
          }
          deacon.current.left = currentAnimation.x;
          deacon.current.top = currentAnimation.y;
        } catch (error) {
          console.warn('ANIMATION COULD NOT PLAY', deacon, error)
        }
      });
      // console.log('maxNumberOfRoutes: ', maxNumberOfRoutes);
      // console.log('maxNumberOfAnimations: ', maxNumberOfAnimations);
      this.setState({
        deacons,
        routeIndex: animationIndex === maxNumberOfAnimations ? routeIndex + 1 : routeIndex,
        animationIndex: animationIndex === maxNumberOfAnimations ? 0 : animationIndex + 1,
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
    }, 20);
  }
  playSegment() {
    const clearMe = setInterval(() => {
      let deacons = this.state.deacons;
      let routeIndex = this.state.routeIndex;
      let animationIndex = this.state.animationIndex;
      let maxNumberOfRoutes = 0;
      let maxNumberOfAnimations = 0;
      // console.log('routeIndex: ', routeIndex);
      // console.log('ANIMATE: ', animationIndex);
      deacons.forEach(deacon => {
        try{
          // console.log('deacon: ', deacon._id);
          // console.log('deacon.route: ', deacon.route);
          const currentRoute = deacon.route[routeIndex];
          // console.log('currentRoute: ', currentRoute);
          const currentAnimation = currentRoute[animationIndex] ||
                currentRoute[currentRoute.length - 1];
          // console.log('currentAnimation: ', currentAnimation);
          if (maxNumberOfRoutes < deacon.route.length){
            maxNumberOfRoutes = deacon.route.length;
          }
          if (maxNumberOfAnimations < currentRoute.length) {
            maxNumberOfAnimations = currentRoute.length;
          }
          deacon.current.left = currentAnimation.x;
          deacon.current.top = currentAnimation.y;
        } catch (error) {
          console.warn('ANIMATION COULD NOT PLAY', deacon, error)
        }
      });
      // console.log('maxNumberOfRoutes: ', maxNumberOfRoutes);
      // console.log('maxNumberOfAnimations: ', maxNumberOfAnimations);
      this.setState({
        deacons,
        animationIndex: animationIndex === maxNumberOfAnimations ? 0 : animationIndex + 1,
      });
      // console.log('maxNumberOfRoutes: ', maxNumberOfRoutes);
      // console.log('this.state.routeIndex: ', this.state.routeIndex);
      if (animationIndex === maxNumberOfAnimations) {
        clearInterval(clearMe);
        this.setState({
          deacons,
          animationIndex: 0,
        });
      }
    }, 20);
  }
  getMaxRoute() {
    const deacons = this.state.deacons;
    const routeLengths = deacons.map(d => d.route && d.route.length);
    return  Math.max(...routeLengths) || 1;
  }
  render(){
    return (
      <div className="">

        <div className="chapel" style = {{
          transform: `scale(${this.props.scale || 1})`,
          height: this.props.chapelLayout.height,
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
        {this.props.isThumbNail ? null :
          this.props.routeId ?
            <div className="step stepOne row">
              <div className="col text-center">
                <i onClick={this.playRoute} className="fa fa-play fa-3x" aria-hidden="true" />
              </div>
            </div>
          :
          <div
            className="interact container"
            style={{
              maxWidth: "300px",
              margin: "10 auto",
            }}
          >
            { this.state.step !== 1 ? null :
              <div>
                <div className="step stepOne row">
                  <div className="col-3 text-center">
                    <i onClick={this.addDeacon} className="fa fa-user-plus fa-3x" aria-hidden="true" />
                  </div>
                  <div className="col-3 text-center">
                    <i onClick={this.editDeacon} className="fa fa-pencil-square-o fa-3x" aria-hidden="true" />
                  </div>
                  <div className="col-3 text-center">
                    <i onClick={this.playRoute} className="fa fa-play fa-3x" aria-hidden="true" />
                  </div>
                  <div className="col-3 text-center">
                    <i onClick={this.saveRoute} className="fa fa-floppy-o fa-3x" aria-hidden="true" />
                  </div>
                </div>
                <hr />
                <h3>Instructions</h3>
                <div className="step stepOne">
                  <div className="form-group">
                    <i className="fa fa-user-plus fa-1x" aria-hidden="true" />
                    &nbsp; Click to add another deacon.
                  </div>
                  <div className="form-group">
                    <i className="fa fa-pencil-square-o fa-1x" aria-hidden="true" />
                    &nbsp; Edit the current selected deacon.
                  </div>
                  <div className="form-group">
                    <i className="fa fa-play fa-1x" aria-hidden="true" />
                    &nbsp; Play.
                  </div>
                  <div className="form-group">
                    <i className="fa fa-floppy-o fa-1x" aria-hidden="true" />
                    &nbsp; Save and exit.
                  </div>
                </div>
              </div>
            }
            { this.state.step !== 2 ? null :
              <div>
                <div className="step stepTwo row">
                  <div className="col-10 text-center">
                    Move selected deacon to seat.
                    Then click the button.
                  </div>
                  <div className="col-2 text-center">
                    <i onClick={this.selectSeatingBench} className="fa fa-step-forward fa-3x" aria-hidden="true" />
                  </div>
                </div>
                <hr />
                <h3>Instructions</h3>
                <div className="step stepTwo">
                  <div className="form-group">
                    <i  className="fa fa-step-forward fa-1x" aria-hidden="true" />
                    &nbsp; Clicking the next icon will take you to the route recording section. And set the deacons current spot as his seat.
                  </div>
                </div>
              </div>
            }
            { this.state.step !== 3 ? null :
              <div>
                <div className="step stepThree row">
                  <div className="col-4 text-center">
                    <i onClick={this.previousSegment} className="fa fa-step-backward fa-3x" aria-hidden="true" />
                  </div>
                  <div className="col-4 text-center">
                    <h2>
                      {this.state.routeIndex + 1}/{this.getMaxRoute()}
                    </h2>
                  </div>
                  <div className="col-4 text-center">
                    <i onClick={this.addRouteSegment} className="fa fa-step-forward fa-3x" aria-hidden="true" />
                  </div>
                </div>
                <div className="step stepThree row">
                  <div className="col-4 text-center">
                    <i onClick={this.resetCurrentSegment} className="fa fa-trash fa-3x" aria-hidden="true" />
                  </div>
                  <div className="col-4 text-center">
                    <i onClick={this.playSegment} className="fa fa-play fa-3x" aria-hidden="true" />
                  </div>
                  <div className="col-4 text-center">
                    <i onClick={this.finalizeRoute} className="fa fa-check-circle fa-3x" aria-hidden="true" />
                  </div>
                </div>
                <hr />
                <h3>Instructions</h3>
                <p> NOTE: Move the deacon to begin recording this segment. </p>
                <div className="step stepThree">
                  <div className="form-group">
                    <i  className="fa fa-step-backward fa-1x" aria-hidden="true" />
                    &nbsp; Go to the previous segment of the route.
                  </div>
                  <div className="form-group">
                    <b> 5/6 </b>
                    &nbsp; Which segment you are editing for this deacon.
                  </div>
                  <div className="form-group">
                    <i  className="fa fa-step-forward fa-1x" aria-hidden="true" />
                    &nbsp; Go to the next segment of the route.
                  </div>
                  <div className="form-group">
                    <i  className="fa fa-trash fa-1x" aria-hidden="true" />
                    &nbsp; Reset this segment for this deacon.
                  </div>
                  <div className="form-group">
                    <i  className="fa fa-play fa-1x" aria-hidden="true" />
                    &nbsp; Play a preview of this segment
                  </div>
                  <div className="form-group">
                    <i  className="fa fa-check-circle fa-1x" aria-hidden="true" />
                    &nbsp; Save this deacons segments and go back to the first step to add a deacon, edit a deacon, or save the route and exit the editor.
                  </div>
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
  chapelLayout: PropTypes.object,
  deacons: PropTypes.array,
  isThumbNail: PropTypes.bool,
};


const mAddRoute = gql`
mutation mAddRoute(
  $stakeId: String!
  $wardId: String!
  $chapel: ChapelInput
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
