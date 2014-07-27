Meteor.methods({
  insertThreshold: function(params) {
    if ( this.userId ) {
      params = params || {};
      if ( canViewApp(params.appId, this.userId) ) {
        return Thresholds.insert({
          appId: params.appId,
          type: params.type,
          value: params.value,
          eventName: params.eventName
        });
      }
    }

    return false
  }
});