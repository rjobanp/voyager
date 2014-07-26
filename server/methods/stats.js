Meteor.methods({
  stats: function(apikey, data) {
    if ( apikey && data && typeof data === 'object' ) {
      var app = Apps.findOne({
        apiKey: apikey
      });

      if ( app && app._id ) {
        data.appId = app._id;

        try {
          return Stats.insert(data);
        } catch (e) {
          return e;
        }
      }
    }
  }
});