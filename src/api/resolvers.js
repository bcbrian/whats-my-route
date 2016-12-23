import { Stakes } from './stakes/Stakes.js';

const TIME_OUT = 500;
const timeoutReject = (reject, message) => {
  setTimeout( () => reject('MongoDB timeout when fetching stakes (timeout is 500ms)'), TIME_OUT);
}
const resolveFunctions = {
  Query: {
    stakes(root, args, context) {
      return new Promise((resolve, reject) => {
        timeoutReject(reject, 'MongoDB timeout when fetching stakes (timeout is 500ms)');
        Stakes.find().then( res => {
          resolve(res || []);
        });
      });
    },
    searchStakes(root, { searchString }, context) {
      const searchTerms = decodeURI(searchString).split(' ');
      const regexTerms = searchTerms.map( st => new RegExp(`.*${st}.*`,'i'));
      return new Promise((resolve, reject) => {
        timeoutReject(reject, 'MongoDB timeout when searching stakes (timeout is 500ms)');
        Stakes.find({name:{ $all: regexTerms }}, (err, stakes) => {
          if (err) return reject('MongoDB failed to find a match for search');
          resolve(stakes || []);
        });
      });
    },
    getStake(root, { stakeId }, context) {
      console.log('Getting the stake :', stakeId);
      return new Promise((resolve, reject) => {
        timeoutReject(reject, 'MongoDB timeout when searching stakes (timeout is 500ms)');
        Stakes.findOne({_id:stakeId}, (err, stake) => {
          if (err) return reject('MongoDB failed to find a match for search');
          resolve(stake || {});
        });
      });
    },
    getWard(root, { stakeId, wardId }, context) {
      console.log('Getting the ward :', stakeId, wardId);
      return new Promise((resolve, reject) => {
        timeoutReject(reject, 'MongoDB timeout when searching stakes (timeout is 500ms)');
        Stakes.findOne({_id:stakeId}, (err, stake) => {
          if (err) return reject('MongoDB failed to find a match for search');
          const ward = stake.wards.find(w => w._id === wardId);
          resolve(ward || {});
        });
      });
    },
    getRoute(root, { stakeId, wardId, routeId }, context) {
      console.log('Getting the route :', stakeId, wardId, routeId);
      return new Promise((resolve, reject) => {
        timeoutReject(reject, 'MongoDB timeout when searching stakes (timeout is 500ms)');
        Stakes.findOne({_id:stakeId}, (err, stake) => {
          if (err) return reject('MongoDB failed to find a match for search');
          const ward = stake.wards.find(w => w._id === wardId);
          const route = ward.routes.find(r => r._id === routeId);
          resolve(route || {});
        });
      });
    },
  },
  Mutation: {
    submitStake(_, {stakeName, wardName}, context) {
      const newStake = new Stakes({
        name: stakeName,
        wards: [{
          name: wardName,
        }]
      });
      return new Promise((resolve, reject) => {
        timeoutReject(reject, 'MongoDB timeout when adding a stake (timeout is 500ms)');
        newStake.save(function (err, stake) {
          if (err) return reject('MongoDB failed to add the stake to the database');
          resolve(stake);
        });
      });
    },
    submitWard(_, {stakeId, wardName}, context) {
      return new Promise((resolve, reject) => {
        timeoutReject(reject, 'MongoDB timeout when adding a ward (timeout is 500ms)');
        Stakes.findByIdAndUpdate(stakeId, { $push: { wards: { name: wardName } } }, { new: true }, function (err, stake) {
          if (err) return reject('MongoDB failed to update the stake to the database');
          resolve(stake);
        });
      });
    },
    submitRoute(_, {stakeId, wardId, chapel, deacons}, context) {
      return new Promise((resolve, reject) => {
        // timeoutReject(reject, 'MongoDB timeout when adding a ward (timeout is 500ms)');
        const route = { chapel, deacons };
        console.log(stakeId, wardId, route);
        // const stake = Stakes.findOne({ _id: stakeId, 'wards._id': wardId}, (err, stake) => {
        //   console.log(stake);
        //   resolve(stake);
        // });

        Stakes.findOneAndUpdate({ _id: stakeId, 'wards._id': wardId}, { $push: { 'wards.$.routes': route } }, { new: true }, function (err, stake) {
          if (err) return reject('MongoDB failed to update the stake to the database');
          console.log(stake);
          const ward = stake.wards.find( w => w._id === wardId);
          const route = ward.routes[ward.routes.length - 1]; // TODO: remove this and pass in an id
          resolve(route);
        });
      });
    },
  },
  Stake:{
    wards({ wards }, _, context) {
      return wards || [];
    },
    wardCount({ wards }, _, context) {
      return wards ? wards.length : 0;
    },
  },
  Ward:{
    routes({ routes }, _, context) {
      return routes || [];
    },
    routeCount({ routes }, _, context) {
      return routes ? routes.length : 0;
    },
  },
  Route:{
    deacons({ deacons }, _, context) {
      return deacons || [];
    },
    deaconCount({ deacons }, _, context) {
      return deacons ? deacons.length : 0;
    },
  },
  Deacon: {
    route({ route }, _, context) {
      return route || [];
    },
    seat({ seat }, _, context) {
      return seat || {};
    },
    current({ current }, _, context) {
      return current || {};
    },
  },
};

export default resolveFunctions;
