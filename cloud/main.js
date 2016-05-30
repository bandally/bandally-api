(function () {
  'use strict';

  require('cloud/like.js');

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
})();
