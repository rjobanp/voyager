Template.apps.helpers({
  apps: function() {
    return Apps.find({
      userIds: Meteor.userId()
    });
  },
  createdFormatted: function() {
    return moment(this.createdAt).format('h:mm a MM/DD/YYYY')
  },
  lastConnectedFormatted: function() {
    return this.lastConnected && moment(this.lastConnected).format('h:mm a MM/DD/YYYY')
  },
  connectionStatus: function() {
    if ( 
      (this.lastConnected && this.lastConnected > Number(this.lastDisconnected)) || 
      (this.lastConnected && !this.lastDisconnected)
     ) {
      return 'green-status'
    }
    return 'red-status'
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