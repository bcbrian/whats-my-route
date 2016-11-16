import Mongoose from 'mongoose';
import shortid from 'shortid';
const mongo = Mongoose.connect('mongodb://whatsmyroute:whatsmyroute@ds059316.mlab.com:59316/whatsmyroute');

const StakeSchema = Mongoose.Schema({
   _id: {
    type: String,
    'default': shortid.generate
  },
  name: String,
  wards: [{
    _id: {
      type: String,
      'default': shortid.generate
    },
    name: String,
    routes: [{
      _id: {
        type: String,
        'default': shortid.generate
      },
      chapel: [Number],
      deacons: [{
        _id: {
          type: String,
          'default': shortid.generate
        },
        route: Number,
        color: String,
        passToBishop: Boolean,
        seat:{
          bench: String,
          top: Number,
          left: Number,
          position: Number,
        },
        route:{
          bench: String,
          top: Number,
          left: Number,
          direction: String,
        },
        bishop:{
          top: Number,
          left: Number,
        },
      }]
    }],
  }],
});

const Stakes = Mongoose.model('stakes', StakeSchema);

export { Stakes };