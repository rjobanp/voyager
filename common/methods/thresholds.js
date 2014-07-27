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
  },
  deleteThreshold: function(thresholdId) {
    var threshold = Thresholds.findOne(thresholdId);

    if ( this.userId && canViewApp(threshold.appId, this.userId) ) {
      return Thresholds.remove(thresholdId);
    }
  },
  updateThreshold: function(thresholdId, updateParams) {
    var threshold = Thresholds.findOne(thresholdId);

    if ( this.userId && canViewApp(threshold.appId, this.userId) ) {
      return Thresholds.update(thresholdId, updateParams);
    }
  }
});