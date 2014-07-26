Apps = new Meteor.Collection('apps');

if (typeof Schema === 'undefined')
  Schema = {};

Schema.App = new SimpleSchema({
  apiKey: {
    type: String
  },
  name: {
    type: String
  },
  hostnames: {
    type: [String],
    optional: true
  },
  userIds: {
    type: [String]
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
  status: {
    type: String,
    optional: true
  },
  lastConnected: {
    type: Number,
    optional: true
  },
  lastDisconnected: {
    type: Number,
    optional: true
  }
});

Apps.attachSchema(Schema.App);