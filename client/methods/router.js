Router.configure({
  layoutTemplate: 'layout',

  yieldTemplates: { 
    'header': { to: 'header' }
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