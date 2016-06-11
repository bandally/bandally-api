var Mailgun = require('mailgun-js');

var api_key = process.env.MAILGUN_API_KEY || 'MAILGUN-API-KEY';
var domain = process.env.MAILGUN_DOMAIN || 'YOUR-DOMAIN.com';
var from_who = process.env.FROM_ADDRESS || 'your@email.com';

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
  var users;
  return message.get('messageRoom').fetch()
    .then(function (messageRoom) {
      var promises = [];
      messageRoom.get('users').forEach(function (user) {
        promises.push(user.fetch());
      });
      return Parse.Promise.when(promises);
    })
    .then(function (users) {
      users = users.filter(function (user) {
        return user.id !== message.get('from').id;
      });
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
    })
    .then(function (saveData) {
      var mailgun = new Mailgun({
        apiKey: api_key,
        domain: domain
      });
      users.forEach(function (user) {
        var data = {
          from: from_who,
          to: user.get('email'),
          subject: 'Received message | bandally',
          html: 'You received message.'
        }
        mailgun.messages().send(data, function (err, body) {
          if (err) {
            console.log("got an error: ", err);
          }
          else {
            console.log(body);
          }
        });
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
