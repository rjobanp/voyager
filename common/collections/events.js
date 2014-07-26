Events = new Meteor.Collection('events');

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