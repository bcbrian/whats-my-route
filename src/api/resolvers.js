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
      const regexTerms = [];
      searchTerms.forEach( st => {
        regexTerms.push(new RegExp(`.*${st}.*`));
      });
      return new Promise((resolve, reject) => {
        timeoutReject(reject, 'MongoDB timeout when searching stakes (timeout is 500ms)');
        Stakes.find({name:{ $all: regexTerms }}, (err, stakes) => {
          if (err) return reject('MongoDB failed to find a match for search');
          resolve(stakes || []);
        });
      });
    }
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
  },
  Stake:{
    wards({ wards }, _, context) {
      return wards;
    },
    wardCount({ wards }, _, context) {
      return wards.length;
    },
  },
};

export default resolveFunctions;
