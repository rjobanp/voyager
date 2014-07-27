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
  },

  waitOn: function() {
    return [
      Meteor.subscribe('userApps')
    ]
  }
});

AppPageController = RouteController.extend({
  onBeforeAction: function() {
    if ( !this.params.appId ) {
      Router.go('appList');
      return;
    }

    Session.set('appId', this.params.appId);

    Session.set('statLimit', 1000);
    Session.set('logLimit', 50);
    Session.set('eventLimit', 50);
  },
  waitOn: function() {
    return [
      Meteor.subscribe('appStats', this.params.appId, Session.get('statLimit')),
      Meteor.subscribe('appLogs', this.params.appId, Session.get('logLimit')),
      Meteor.subscribe('appEvents', this.params.appId, Session.get('eventLimit')),
      Meteor.subscribe('appThresholds', this.params.appId)
    ]
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

  this.route('app', {
    path: '/app/:appId',
    template: 'app',
    controller: AppPageController
  });

  this.route('appConfig', {
    path: '/app/config/:appId',
    template: 'appConfig',
    controller: AppPageController
  });

});