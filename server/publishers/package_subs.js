Meteor.publish('serverEvents', function(apiKey) {
  if ( apiKey && apiKey[0] ) {
    var app = Apps.findOne({
      apiKey: apiKey[0]
    });

    if ( app && app._id ) {
      // Track connection state for this app
      registerAppConnectionState(this.connection, app);

      return VoyagerEvents.find({
        appId: app._id,
        complete: false
      }, {
        sort: {
          createdAt: -1
        },
        limit: 5
      });
    }
  }
});

registerAppConnectionState = function(connection, app) {
  if ( connection && app ) {
    // Set last connected time and log hostname
    Apps.update(app._id, {
      $set: {
        lastConnected: +moment()
      },
      $addToSet: {
        hostnames: connection.clientAddress
      }
    }, function(e,r) {

    });

    connection.onClose(function() {
      Apps.update(this._id, {
        $set: {
          lastDisconnected: +moment()
        }
      });
    }.bind(app));
  }
}