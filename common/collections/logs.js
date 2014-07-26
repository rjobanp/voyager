Logs = new Meteor.Collection('logs');

if (typeof Schema === 'undefined')
  Schema = {};

Schema.Log = new SimpleSchema({
  _id: {
    type: String
  },
  appId: {
    type: String
  },
  time: {
    type: Number
  },
  message: {
    type: String,
    optional: true
  },
  level: {
    type: String,
    optional: true
  },
  data: {
    type: Object,
    blackbox: true,
    optional: true
  }
});

Logs.attachSchema(Schema.Log);