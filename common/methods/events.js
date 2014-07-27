Meteor.methods({
  addEvent: function(params) {
    if ( this.userId && canViewApp(params.appId, this.userId) ) {
      var data = {
        direction: params.direction,
        currentValue: params.value
      };
      return VoyagerEvents.insert({
        appId: params.appId,
        type: params.eventName,
        data: data,
        complete: false
      });
    } else {
      return false;
    }
  }
});