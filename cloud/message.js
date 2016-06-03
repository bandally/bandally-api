exports.afterSave = afterSave;
exports.afterDelete = afterDelete;

function afterSave(request) {
  addNotifications(request);
}

function afterDelete(request) {
  removeNotifications(request);
}

function addNotifications(request) {
  var message = request.object;
  return message.get('messageRoom').fetch().then(function (messageRoom) {
    return messageRoom.get('users').fetch().then(function (users) {
      console.log(JSON.stringify(users));
      users = users.filter(function (user) {
        return user.id !== message.get('from').id;
      });
      console.log(JSON.stringify(users));
      var Notification = Parse.Object.extend('Notification');
      var saveData = [];
      users.forEach((user) => {
        var notification = new Notification();
        notification.set('message', message);
        notification.set('user', user);
        notification.setACL(new Parse.ACL(user));
        saveData.push(notification);
      });
      return Parse.Object.saveAll(saveData);
    });
  });
}

function removeNotifications(request) {
  Parse.Cloud.useMasterKey();
  var message = request.object;
  var Notification = Parse.Object.extend('Notification');
  var query = new Parse.Query(Notification);
  query.equalTo('message', message);
  return query.find().then(function (notifications) {
    return Parse.Object.destroyAll(notifications);
  });
}
