Template.app.helpers({
  app: function() {
    return Apps.findOne(Session.get('appId'))
  }
});