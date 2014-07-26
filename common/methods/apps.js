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
  }
});