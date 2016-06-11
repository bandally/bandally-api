var Mailgun = require('mailgun-js');

var api_key = process.env.MAILGUN_API_KEY || 'MAILGUN-API-KEY';
var domain = process.env.MAILGUN_DOMAIN || 'YOUR-DOMAIN.com';
var from_who = process.env.FROM_ADDRESS || 'your@email.com';

var mailgun = new Mailgun({
  apiKey: api_key,
  domain: domain
});

exports.send = send;

function send(to, subject, body) {
  var data = {
    from: from_who,
    to: to,
    subject: subject,
    html: body
  };
  mailgun.messages().send(data, function (err, body) {
    if (err) {
      console.log('got an error: ', err);
    } else {
      console.log(body);
    }
  });
}
