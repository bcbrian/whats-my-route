import Mongoose from 'mongoose';
import shortid from 'shortid';

const mongo = Mongoose.connect(process.env.MONGO_URL);

const StakeSchema = Mongoose.Schema({
   _id: {
    type: String,
    'default': shortid.generate
  },
  name: String,
  wards: [{
    _id: {
      type: String,
      default: shortid.generate
    },
    name: String,
    routes: [{
      _id: {
        type: String,
        default: shortid.generate
      },
      chapel: {
        version: Number,
        benches: [Number],
        height: Number,
      },
      deacons: [{
        _id: {
          type: String,
          default: shortid.generate
        },
        color: String,
        seat: {
          top: Number,
          left: Number,
        },
        current: {
          top: Number,
          left: Number,
        },
        route: [[{
          x: Number,
          y: Number,
        }]],
      }],
    }],
  }],
});

const Stakes = Mongoose.model('stakes', StakeSchema);

export { Stakes };
