var Like = require('./like');
var Comment = require('./comment');

Parse.Cloud.afterSave('Like', Like.afterSave);
Parse.Cloud.afterSave('Comment', Comment.afterSave);
Parse.Cloud.afterDelete('Like', Like.afterDelete);
Parse.Cloud.afterDelete('Comment', Comment.afterDelete);

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
