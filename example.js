var Leanpub = require('./');
var apikey = process.env.LEANPUB_API_KEY;
var book = 'learnjs';

var leanpub = new Leanpub(apikey);

leanpub.sales({ slug: book, report: 'summary' }, function(err, res){
  console.log(res.total_book_royalties);
});

leanpub.sales({ slug: book, report: 'all' }, function(err, res){
  console.log(res.length);
});

leanpub.preview({ slug: book }, function(err, res){
  console.log(res);
});

var status = leanpub.status({ slug: book, poll: true }, function(err, res){
  console.log(res)
});

status.on('response', function(currentStatus, oh){
  console.log('step: ', currentStatus.num);
});

status.on('done', function(res){
  console.log('not processing', res)
});
