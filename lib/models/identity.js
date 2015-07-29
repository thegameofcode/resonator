var mongoose = require('mongoose');
var config = require('config');
var IdentitySchema, model;

IdentitySchema = mongoose.Schema({
  ts: {type: Date, default: Date.now, required: true},
  devices: {
    gcm: [{type: String, trim: true}],
    apn: [{type: String, trim: true}],
    phone: [{type: String, trim: true}],
    sms: [{type: String, trim: true}],
    email: [{type: String, trim: true,
      match: [new RegExp(config.get('validations.email'), 'i'), 'Email not valid']
    }]
  },
  channels: [{type: mongoose.Schema.Types.ObjectId}]
});

IdentitySchema.pre('save', function(next) {

  var devices = {
    gcm: this.devices.gcm,
    apn: this.devices.apn,
    phone: this.devices.phone,
    sms: this.devices.sms,
    email: this.devices.email
  };

  this.devices = devices;
  return next();
});

IdentitySchema.virtual('id').get(function() {
  return this._id;
});

model = mongoose.model('Identity', IdentitySchema);

module.exports = model;
