Parse.Cloud.define('getBase64StringFromUrl', function (req, res) {
  Parse.Cloud.httpRequest({
    url: req.params.imageUrl
  }).then(function (httpImgFile) {
    return httpImgFile.buffer.toString('base64');
  });
});
