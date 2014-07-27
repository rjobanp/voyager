Meteor.publish('userApps', function() {
  if ( this.userId ) {
    return Apps.find({
      userIds: this.userId
    });
  } else {
    this.ready();
  }
});

Meteor.publish('appStats', function(appId, statLimit) {
  if ( this.userId && canViewApp(appId, this.userId) ) {
    return Stats.find({
      appId: appId
    }, {
      sort: {
        createdAt: -1
      },
      limit: statLimit || 100
    });
  } else {
    this.ready();
  }
});

Meteor.publish('appLogs', function(appId, logLimit) {
  if ( this.userId && canViewApp(appId, this.userId) ) {
    return Logs.find({
      appId: appId
    }, {
      sort: {
        createdAt: -1,
      },
      limit: logLimit || 50
    });
  } else {
    this.ready();
  }
});

Meteor.publish('appEvents', function(appId, eventLimit) {
  if ( this.userId && canViewApp(appId, this.userId) ) {
    return VoyagerEvents.find({
      appId: appId
    }, {
      sort: {
        createdAt: -1
      },
      limit: eventLimit || 50
    });
  } else {
    this.ready();
  }
});

Meteor.publish('appThresholds', function(appId) {
  if ( this.userId && canViewApp(appId, this.userId) ) {
    return Thresholds.find({
      appId: appId
    });
  } else {
    this.ready();
  }
});
