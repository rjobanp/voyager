Logs = new Meteor.Collection('logs');

if (typeof Schema === 'undefined')
  Schema = {};

Schema.Log = new SimpleSchema({
  appId: {
    type: String
  },
  createdAt: {
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