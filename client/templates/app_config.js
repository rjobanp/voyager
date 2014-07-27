Template.appConfig.events({
  'click .app-button': function() {
    Router.go('app', {appId: this._id});
  }
});

Template.appConfig.helpers({
  app: function() {
    return Apps.findOne(Session.get('appId'))
  }
});