const mongoose = require('mongoose');
const _ = require('underscore');

let StopModel = {};

// mongoose.Types.ObectID is a function that
// converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const StopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  address: {
    type: String,
    min: 0,
    required: true,
  },

  dispatch: {
    type: Number,
    min: 1,
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdDate: {
    type: Date,
    defualt: Date.now,
  },
});

StopSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  level: doc.level,
});

StopSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return StopModel.find(search).select('name address dispatch').lean().exec(callback);
};

StopSchema.statics.removeStop = (domoId, callback) => {
  const search = {
    _id: convertId(domoId),
  };

  return StopModel.findByIdAndDelete(search).exec(callback);
};

StopModel = mongoose.model('Stop', StopSchema);

module.exports.StopModel = StopModel;
module.exports.DomoSchema = StopSchema;
