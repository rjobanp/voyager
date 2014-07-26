Template.apps.helpers({
  apps: function() {
    return Apps.find({
      userIds: Meteor.userId()
    });
  }
});

Template.apps.events({
  'click .app-row': function(e,t) {
    Router.go('app', {appId: this._id});
  }
});