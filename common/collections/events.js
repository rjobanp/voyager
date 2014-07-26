Events = new Meteor.Collection('events');

if (typeof Schema === 'undefined')
  Schema = {};

Schema.Event = new SimpleSchema({
  _id: {
    type: String
  },
  appId: {
    type: String
  },
  time: {
    type: Number
  },
  type: {
    type: String,
    optional: true
  },
  complete: {
    type: Boolean,
    autoValue: function() {
      if (this.isInsert) {
        return false;
      } else if (this.isUpsert) {
        return {$setOnInsert: false};
      } else {
        this.unset();
      }
    }
  },
  data: {
    type: Object,
    blackbox: true,
    optional: true
  }
});

Events.attachSchema(Schema.Event);