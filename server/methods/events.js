Meteor.methods({
  eventComplete: function(params) {
    params = params || [];
    var apikey = params[0];
    var eventId = params[1];

    if ( apikey && eventId ) {
      var app = Apps.findOne({
        apiKey: apikey
      });

      var event = Events.findOne(eventId);

      if ( app && app._id && event && event.appId === app._id ) {
        try {
          return Events.update(eventId, {
            $set: {
              completed: true
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

  var lastEvent = Events.find({
    appId: threshold.appId,
    type: threshold.eventName
  }, {
    sort: {
      createdAt: -1
    },
    limit: 1
  });

  if ( lastEvent && lastEvent.createdAt > +moment().subtract(5, 'minutes') ) {
    return false
  } else {
    // insert the new event
    return Events.insert({
      appId: threshold.appId,
      type: threshold.eventName,
      data: eventData
    });
  }
}