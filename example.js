var Leanpub = require('./');
var apikey = process.env.LEANPUB_API_KEY;
var book = 'learnjs';

var leanpub = new Leanpub(apikey);

leanpub.sales(book, 'summary', function(err, res){
  console.log(res.total_book_royalties);
});

leanpub.sales(book, 'all', function(err, res){
  console.log(res.length);
});

var status = leanpub.status(book, function(err, res){
  console.log('this is probably unnecessary')
});

status.on('response', function(currentStatus, oh){
  console.log('yeah', currentStatus.num, oh);
});

status.on('done', function(res){
  console.log('not processing', res)
});
