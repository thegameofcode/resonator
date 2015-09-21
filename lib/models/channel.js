var mongoose = require('mongoose');
var ChannelSchema, model;

ChannelSchema = mongoose.Schema({
  ts: {type: Date, default: Date.now, required: true},
  name: {type: String, unique: true, required: true},
  identityRef: [{type: mongoose.Schema.Types.ObjectId, ref: 'Identity'}]
});


ChannelSchema.virtual('id').get(function() {
  return this._id;
});

//ChannelSchema.index({name: 1}, {unique: true});

model = mongoose.model('Channel', ChannelSchema);

module.exports = model;
