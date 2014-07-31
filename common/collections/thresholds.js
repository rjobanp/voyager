Thresholds = new Meteor.Collection('thresholds');

Meteor.startup(function() {
  if ( Meteor.isServer ) {
    Thresholds._ensureIndex({appId: 1});
    Thresholds._ensureIndex({appId: 1, type: 1});
  }
});

if (typeof Schema === 'undefined')
  Schema = {};

Schema.Threshold = new SimpleSchema({
  appId: {
    type: String
  },
  createdAt: {
    type: Number,
    autoValue: function() {
      if (this.isInsert) {
        return +moment();
      } else if (this.isUpsert) {
        return {$setOnInsert: +moment()};
      } else {
        this.unset();
      }
    }
  },
  type: {
    type: String,
    allowedValues: ['cpu', 'memory', 'loadAvg']
  },
  value: {
    type: Number,
    decimal: true
  },
  eventName: {
    type: String
  }
});

Thresholds.attachSchema(Schema.Threshold);