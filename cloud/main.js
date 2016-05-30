var Like = require('./like');
var Comment = require('./comment');

Parse.Cloud.afterSave('Like', Like.updateLikesCount);
Parse.Cloud.afterSave('Comment', Comment.updateCommentsCount);
Parse.Cloud.afterDelete('Like', Like.updateLikesCount);
Parse.Cloud.afterDelete('Comment', Comment.updateCommentsCount);

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
