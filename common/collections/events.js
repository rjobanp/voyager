VoyagerEvents = new Meteor.Collection('voyagerevents');

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
    type: Boolean,
    autoValue: function() {
      return false
    }
  },
  data: {
    type: Object,
    blackbox: true,
    optional: true
  }
});

VoyagerEvents.attachSchema(Schema.Event);