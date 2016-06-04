var Spot = require('./spot');
var Like = require('./like');
var Comment = require('./comment');
var Follow = require('./follow');
var Message = require('./message');

Parse.Cloud.beforeSave('Spot', Spot.beforeSave);
Parse.Cloud.afterSave('Like', Like.afterSave);
Parse.Cloud.afterSave('Comment', Comment.afterSave);
Parse.Cloud.afterSave('Follow', Follow.afterSave);
Parse.Cloud.afterSave('Message', Message.afterSave);
Parse.Cloud.afterDelete('Spot', Spot.afterDelete);
Parse.Cloud.afterDelete('Like', Like.afterDelete);
Parse.Cloud.afterDelete('Comment', Comment.afterDelete);
Parse.Cloud.afterDelete('Follow', Follow.afterDelete);
Parse.Cloud.afterDelete('Message', Message.afterDelete);

Parse.Cloud.define('getBase64StringFromUrl', function (request, response) {
  Parse.Cloud.useMasterKey();
  Parse.Cloud.httpRequest({
    url: request.params.imageUrl
  }).then(function (httpImgFile) {
    response.success(httpImgFile.buffer.toString('base64'));
  }, function (error) {
    response.error(error);
  });
});
