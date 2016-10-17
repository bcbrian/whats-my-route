import Mongoose from 'mongoose';
import shortid from 'shortid';
const mongo = Mongoose.connect('mongodb://whatsmyroute:whatsmyroute@ds059316.mlab.com:59316/whatsmyroute');

const StakeSchema = Mongoose.Schema({
  name: String,
  wards: [{
    name: String,
    _id: {
      type: String,
      'default': shortid.generate
    },
  }],
});

const Stakes = Mongoose.model('stakes', StakeSchema);

export { Stakes };