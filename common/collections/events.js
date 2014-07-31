VoyagerEvents = new Meteor.Collection('voyagerevents');

Meteor.startup(function() {
  if ( Meteor.isServer ) {
    VoyagerEvents._ensureIndex({appId: 1});
    VoyagerEvents._ensureIndex({appId: 1, createdAt: -1});
    VoyagerEvents._ensureIndex({appId: 1, type: 1, createdAt: -1});
  }
});

if (typeof Schema === 'undefined')
  Schema = {};

Schema.Event = new SimpleSchema({
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
    type: String
  },
  complete: {
    type: Boolean
  },
  data: {
    type: Object,
    blackbox: true,
    optional: true
  }
});

VoyagerEvents.attachSchema(Schema.Event);