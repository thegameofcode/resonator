'use strict';

const mongoose = require('mongoose');
let ChannelSchema, model;

ChannelSchema = mongoose.Schema({ // eslint-disable-line new-cap
  ts: {type: Date, default: Date.now, required: true},
  name: {type: String, unique: true, required: true},
  identityRef: [{type: mongoose.Schema.Types.ObjectId, ref: 'Identity'}]
});


ChannelSchema.virtual('id').get(function() {
  return this._id;
});

model = mongoose.model('Channel', ChannelSchema);

module.exports = model;
