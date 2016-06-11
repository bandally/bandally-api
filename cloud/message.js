var Mail = require('./mail');

exports.afterSave = afterSave;
exports.afterDelete = afterDelete;

function afterSave(request) {
  addNotifications(request);
}

function afterDelete(request) {
  removeNotifications(request);
}

function addNotifications(request) {
  Parse.Cloud.useMasterKey();
  var message = request.object;
  var receiveUsers;
  return message.get('messageRoom').fetch()
    .then(function (messageRoom) {
      var promises = [];
      messageRoom.get('users').forEach(function (user) {
        promises.push(user.fetch());
      });
      return Parse.Promise.when(promises);
    })
    .then(function (users) {
      receiveUsers = users.filter(function (user) {
        return user.id !== message.get('from').id;
      });
      var Notification = Parse.Object.extend('Notification');
      var saveData = [];
      receiveUsers.forEach((user) => {
        var notification = new Notification();
        notification.set('message', message);
        notification.set('user', user);
        notification.setACL(new Parse.ACL(user));
        saveData.push(notification);
      });
      return Parse.Object.saveAll(saveData);
    })
    .then(function (saveData) {
      receiveUsers.forEach(function (user) {
        var to = user.get('email');
        var subject = 'Received message | bandally';
        var body = '<p>You received a message.</p><p>Check your <a href="https:' + process.env.DOCUMENT_ROOT + '">message box</a></p>';
        Mail.send(to, subject, body);
      });
    }, function (error) {
      console.log(error);
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
