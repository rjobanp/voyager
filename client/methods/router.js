Router.configure({
  layoutTemplate: 'layout',

  yieldTemplates: { 
    'header': { to: 'header' }
  },


  onBeforeAction: function(pause) {
    var user = Meteor.user();
    var route = this.route.name;
    if ( route === 'home' && user ) {
      Router.go('appList');
      return;
    } else if ( !user && ['appList', 'addApp', 'app'].indexOf(route) > -1 ) {
      Router.go('home');
      return;
    }
  }
});

Router.map(function() {

  this.route('home', {
    path: '/',
    template: 'home'
  });

  this.route('appList', {
    path: '/apps',
    template: 'apps'
  });

  this.route('addApp', {
    path: '/add',
    template: 'addApp'
  });

  this.route('app', {
    path: '/app/:appId',
    template: 'app'
  });

});