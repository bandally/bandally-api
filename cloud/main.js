Parse.Cloud.define('getBase64StringFromUrl', function (req, res) {
  Parse.Cloud.useMasterKey();
  console.log(req.params);
  Parse.Cloud.httpRequest({
    url: req.params.imageUrl
  }).then(function (httpImgFile) {
    console.log(httpImgFile);
    return httpImgFile.buffer.toString('base64');
  });
});
