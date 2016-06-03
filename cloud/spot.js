exports.afterDelete = afterDelete;

function afterDelete(request) {
  removeContents(request);
  removeAllLikes(request);
  removeAllComments(request);
}

function removeContents(request) {
  var spot = request.object;
  return Parse.Object.destroyAll(spot.get('contents'));
}

function removeAllLikes(request) {
  Parse.Cloud.useMasterKey();
  var spot = request.object;
  var Like = Parse.Object.extend('Like');
  var query = new Parse.Query(Like);
  query.equalTo('spot', spot);
  return query.find().then(function (likes) {
    return Parse.Object.destroyAll(likes);
  });
}

function removeAllComments(request) {
  Parse.Cloud.useMasterKey();
  var spot = request.object;
  var Comment = Parse.Object.extend('Comment');
  var query = new Parse.Query(Comment);
  query.equalTo('spot', spot);
  return query.find().then(function (comments) {
    return Parse.Object.destroyAll(comments);
  });
}
