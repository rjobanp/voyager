Logs = new Meteor.Collection('logs');

Meteor.startup(function() {
  if ( Meteor.isServer ) {
    Logs._ensureIndex({appId: 1});
    Logs._ensureIndex({appId: 1, createdAt: -1});
  }
});

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