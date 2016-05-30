(function () {
  'use strict';

  exports function updateLikesCount(request) {
    var spot = request.object.get('spot');
    var query = new Parse.Query('Like');
    query.equalTo('spot', spot);
    query.count().then(function (count) {
      spot.set('likesCount', count);
      return spot.save();
    });
  }
})();
