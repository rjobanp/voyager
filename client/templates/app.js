Template.app.events({
  'click .config-button': function() {
    Router.go('appConfig', {appId: this._id});
  }
});

Template.app.helpers({
  app: function() {
    return Apps.findOne(Session.get('appId'))
  },
  createdFormatted: function() {
    return moment(this.createdAt).format('h:mm a MM/DD/YYYY')
  },
  stats: function() {
    return Stats.find({
      appId: this._id
    }, {
      sort: {
        createdAt: -1
      },
      limit: 10
    });
  },
  logs: function() {
    return Logs.find({
      appId: this._id
    }, {
      sort: {
        createdAt: -1
      },
      limit: 10
    });
  },
  eventList: function() {
    return Events.find({
      appId: this._id
    }, {
      sort: {
        createdAt: -1
      },
      limit: 10
    });
  }
});