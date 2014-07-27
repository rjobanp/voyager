Meteor.methods({
  eventComplete: function(params) {
    params = params || [];
    var apikey = params[0];
    var eventId = params[1];

    if ( apikey && eventId ) {
      var app = Apps.findOne({
        apiKey: apikey
      });

      var event = VoyagerEvents.findOne(eventId);

      if ( app && app._id && event && event.appId === app._id ) {
        try {
          return VoyagerEvents.update(eventId, {
            $set: {
              complete: true
            }
          });
        } catch (e) {
          return e;
        }
      }
    }
  }
});

triggerEventFromThreshold = function(threshold, p0, p1) {
  var eventData = {
    currentValue: p1
  };

  if ( p1 > p0 ) {
    eventData.direction = 'over';
  } else {
    eventData.direction = 'under';
  }

  var lastEvent = VoyagerEvents.find({
    appId: threshold.appId,
    type: threshold.eventName
  }, {
    sort: {
      createdAt: -1
    },
    limit: 1
  }).fetch();

  if ( lastEvent && lastEvent.length && lastEvent[0].createdAt > +moment().subtract(5, 'minutes') ) {
    return false
  } else {
    
    // check for a yo username and send a yo
    sendYoToAppUsers(threshold.appId);

    // insert the new event
    return VoyagerEvents.insert({
      appId: threshold.appId,
      type: threshold.eventName,
      data: eventData,
      complete: false
    });
  }
}