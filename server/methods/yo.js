var Yo = Meteor.require('yo-api');

yo = new Yo('755d1eb1-fde3-beed-3a02-ce2d0ab60b37');

sendYoToAppUsers = function(appId) {
  var app = Apps.findOne(appId);
  if ( app && app.yoUserNames && app.yoUserNames.length ) {
    _.each(app.yoUserNames, function(username) {
      yo.yo(username, function(err, res, body) {

      });
    });
  };
}