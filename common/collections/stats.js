Stats = new Meteor.Collection('stats');

Meteor.startup(function() {
  if ( Meteor.isServer ) {
    Stats._ensureIndex({appId: 1});
    Stats._ensureIndex({appId: 1, createdAt: -1});
  }
});

if (typeof Schema === 'undefined')
  Schema = {};

Schema.Stat = new SimpleSchema({
  appId: {
    type: String
  },
  createdAt: {
    type: Number
  },
  cpu: {
    type: Object,
    blackbox: true,
    optional: true
  },
  memory: {
    type: Object,
    blackbox: true,
    optional: true
  },
  loadAvg: {
    type: Object,
    blackbox: true,
    optional: true
  }
});

Stats.attachSchema(Schema.Stat);