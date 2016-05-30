exports.updateCommentsCount = updateCommentsCount;

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
