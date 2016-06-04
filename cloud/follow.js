exports.afterSave = afterSave;
exports.afterDelete = afterDelete;

function afterSave(request) {
  updateFollowingCount(request);
  updateFollowersCount(request);
  addNotification(request);
}

function afterDelete(request) {
  updateFollowingCount(request);
  updateFollowersCount(request);
  removeNotification(request);
}

function updateFollowingCount(request) {
  Parse.Cloud.useMasterKey();
  var user = request.object.get('from');
  var query = new Parse.Query('Follow');
  query.equalTo('from', user);
  return query.count().then(function (count) {
    user.set('followingCount', count);
    return user.save();
  });
}

function updateFollowersCount(request) {
  Parse.Cloud.useMasterKey();
  var user = request.object.get('to');
  var query = new Parse.Query('Follow');
  query.equalTo('to', user);
  return query.count().then(function (count) {
    user.set('followersCount', count);
    return user.save();
  });
}

function addNotification(request) {
  var follow = request.object;
  return follow.get('to').fetch().then(function (user) {
    var Notification = Parse.Object.extend('Notification');
    var notification = new Notification();
    notification.set('follow', follow);
    notification.set('user', user);
    notification.setACL(new Parse.ACL(user));
    return notification.save();
  });
}

function removeNotification(request) {
  Parse.Cloud.useMasterKey();
  var follow = request.object;
  var Notification = Parse.Object.extend('Notification');
  var query = new Parse.Query(Notification);
  query.equalTo('follow', follow);
  return query.find().then(function (notifications) {
    return Parse.Object.destroyAll(notifications);
  });
}
