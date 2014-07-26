Template.apps.helpers({
  apps: function() {
    return Apps.find({
      userIds: Meteor.userId()
    });
  },
  createdFormatted: function() {
    return moment(this.createdAt).format('h:mm a MM/DD/YYYY')
  }
});

Template.apps.events({
  'click .app-row': function(e,t) {
    Router.go('app', {appId: this._id});
  },
  'click .create-new-app, submit .create-new-app-form': function(e,t) {
    e.preventDefault();
    e.stopPropagation();

    Meteor.call('addApp', {
      name: t.find('#new-app-name').value
    });
  }
});