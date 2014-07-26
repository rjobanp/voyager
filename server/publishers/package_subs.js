Meteor.publish('serverEvents', function(apiKey) {
  if ( apiKey ) {
    var app = Apps.findOne({
      apiKey: apiKey
    });

    if ( app && app._id ) {
      return Events.find({
        appId: appId,
        completed: false
      }, {
        sort: {
          createdAt: -1
        },
        limit: 5
      });
    }
  }
})