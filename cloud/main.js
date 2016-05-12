Parse.Cloud.define('getBase64StringFromUrl', function (req, res) {
  Parse.Cloud.useMasterKey();
  Parse.Cloud.httpRequest({
    url: req.params.imageUrl
  }).then(function (httpImgFile) {
    res.success(httpImgFile.buffer.toString('base64'));
  }, function (error) {
    res.error(error);
  });
});
