exports.get = get;
exports.beforeSave = beforeSave;
exports.afterDelete = afterDelete;

function get(request, response) {
  var spotIds = request.params.spotIds;
  var Spot = Parse.Object.extend('Spot');
  var innerQueries = [];
  spotIds.forEach(function (spotId) {
    var innerQuery = new Parse.Query(Spot);
    innerQuery.equalTo('objectId', spotId);
    innerQueries.push(innerQuery);
  });
  var query = Parse.Query.or(...innerQueries);
  query.include(['user', 'contents.language', 'category']);
  query.find().then(function (spots) {
    response.success(spots);
  }, function (error) {
    response.error(error);
  });
}

function beforeSave(request, response) {
  if (!request.object.isNew()) {
    return response.success();
  }
  var validation = validate(request.object);
  if (!validation.result) {
    return response.error(validation.message);
  }
  return response.success();
}

function validate(spot) {
  if (!spot.get('user')) {
    return { result: false, message: 'user is not defined.' };
  }
  if (!spot.get('category')) {
    return { result: false, message: 'category is not defined.' };
  }
  if (!spot.get('location')) {
    return { result: false, message: 'location is not defined.' };
  }
  if (!spot.get('photos') || !spot.get('photos').length) {
    return { result: false, message: 'photos is not defined.' };
  }
  if (!spot.get('contents') || !spot.get('contents').length) {
    return { result: false, message: 'contents is not defined.' };
  }
  return { result: true };
}

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
