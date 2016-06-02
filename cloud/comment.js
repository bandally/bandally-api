exports.afterSave = afterSave;
exports.afterDelete = afterDelete;

function afterSave(request) {
  updateCommentsCount(request);
  addNotification(request);
}

function afterDelete(request) {
  updateCommentsCount(request);
  removeNotification(request);
}

function updateCommentsCount(request) {
  Parse.Cloud.useMasterKey();
  var spot = request.object.get('spot');
  var query = new Parse.Query('Comment');
  query.equalTo('spot', spot);
  query.count().then(function (count) {
    spot.set('commentsCount', count);
    return spot.save();
  });
}

function addNotification(request) {
  var comment = request.object;
  var user = comment.get('spot').get('user');
  var Notification = Parse.Object.extend('Notification');
  var notification = new Notification();
  notification.set('comment', comment);
  notification.set('user', user);
  notification.setACL(new Parse.ACL(user));
  return notification.save();
}

function removeNotification(request) {
  Parse.Cloud.useMasterKey();
  var comment = request.object;
  var user = comment.get('spot').get('user');
  var Notification = Parse.Object.extend('Notification');
  var query = new Parse.Query(Notification);
  query.equalTo('comment', comment);
  return query.find().then(function (notifications) {
    return Parse.Object.destroyAll(notifications);
  });
}
