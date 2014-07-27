Template.header.events({
  'click .apps-button': function() {
    Router.go('appList');
  },
  'click .navbar-brand': function() {
    Router.go('home');
  }
});