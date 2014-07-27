Meteor.publish('serverEvents', function(apiKey) {
  if ( !!apiKey ) {
    var app = Apps.findOne({
      apiKey: apiKey[0]
    });

    if ( app && app._id ) {
      console.log(app._id);
      return VoyagerEvents.find({
        appId: app._id,
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