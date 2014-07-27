Meteor.methods({
  addApp: function(params) {
    if ( this.userId ) {
      return Apps.insert({
        name: params.name,
        apiKey: new Meteor.Collection.ObjectID().toHexString(),
        userIds: [this.userId]
      });
    } else {
      return false;
    }
  },
  updateApp: function(params) {
    if ( this.userId && canViewApp(params.appId, this.userId) ) {
      return Apps.update(params.appId, {
        $addToSet: {
          yoUserNames: params.yoUserName
        }
      });
    } else {
      return false;
    }
  }
});