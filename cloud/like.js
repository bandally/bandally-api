exports.afterSave = afterSave;
exports.afterDelete = afterDelete;

function afterSave(request) {
  updateLikesCount(request);
  addNotification(request);
}

function afterDelete(request) {
  updateLikesCount(request);
  removeNotification(request);
}

function updateLikesCount(request) {
  Parse.Cloud.useMasterKey();
  var spot = request.object.get('spot');
  var query = new Parse.Query('Like');
  query.equalTo('spot', spot);
  return query.count().then(function (count) {
    spot.set('likesCount', count);
    return spot.save();
  });
}

function addNotification(request) {
  var like = request.object;
  return like.get('spot').fetch().then(function (spot) {
    var user = spot.get('user');
    var Notification = Parse.Object.extend('Notification');
    var notification = new Notification();
    notification.set('like', like);
    notification.set('user', user);
    notification.setACL(new Parse.ACL(user));
    return notification.save();
  });
}

function removeNotification(request) {
  Parse.Cloud.useMasterKey();
  var like = request.object;
  var user = like.get('spot').get('user');
  var Notification = Parse.Object.extend('Notification');
  var query = new Parse.Query(Notification);
  query.equalTo('like', like);
  return query.find().then(function (notifications) {
    return Parse.Object.destroyAll(notifications);
  });
}
