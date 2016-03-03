var azure = require('azure-storage');
var queue = require('queue');
var ProgressBar = require('progress');
var createReadStream = require('streamifier').createReadStream;
var mime = require('mime');

module.exports = function (opts) {
  if (!opts.account) {
    throw new Error('Missing account option.');
  }

  if (!opts.container) {
    throw new Error('Missing container option.');
  }
  var prefix = opts.prefix || '';

  return function (files, metalsmith, done) {
    var service = azure
      .createBlobService(opts.account, opts.key)
      .withFilter(new azure.LinearRetryPolicyFilter());

    var q = queue({ concurrency: 4, timeout: 1000 * 60 * 2 });
    var count = 0;

    Object.keys(files).forEach(function (path) {
      var file = files[path];
      q.push(function(cb) {
        var istream = createReadStream(file.contents);
        var ostream = service.createWriteStreamToBlockBlob(
          opts.container,
          prefix + path,
            {
              metadata: { fsmode: file.mode },
              contentType: mime.lookup(path),
            },
          function (err) {
            if (err) {
              cb(err);
            } else {
              cb();
            }
          }
        );

        istream.pipe(ostream);
      });
    });


    service.createContainerIfNotExists(opts.container, function (err) {
      if (err) {
        throw err;
      } else {
        if (!opts.quiet && q.length > 0) {
          var bar = new ProgressBar('uploading [:bar] :percent', { total: q.length });
          bar.tick(0);
          q.on('success', function () {
            count++;
            bar.tick();
          });
        }

        q.on('error', function (err) { throw err; });
        q.start(function () {
          if (!opts.quiet) {
            console.log(count + ' files uploaded.');
          }
          done();
        });
      }
    });
  };
};
