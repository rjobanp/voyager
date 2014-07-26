canViewApp = function(appId, userId) {
  var app = Apps.findOne(appId);
  if ( app && app.userIds.indexOf(userId) > -1 ) {
    return true;
  } else {
    return false;
  }
}