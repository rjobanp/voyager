Stats = new Meteor.Collection('stats');

if (typeof Schema === 'undefined')
  Schema = {};

Schema.Stat = new SimpleSchema({
  _id: {
    type: String
  },
  appId: {
    type: String
  },
  time: {
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
  load: {
    type: Object,
    blackbox: true,
    optional: true
  }
});

Stats.attachSchema(Schema.Stat);