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