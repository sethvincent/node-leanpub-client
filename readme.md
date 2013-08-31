# leanpub-client
> a node.js api wrapper for [leanpub.com](http://leanpub.com).

## known issues:
- currently only supports json. a pull request adding xml support would be accepted.
- paging through all individual purchases currently isn't supported. that'll be an easy fix.

## installation

```
npm install leanpub-client
```

## usage example

```
var Leanpub = require('leanpub-client');

var apikey = process.env.LEANPUB_API_KEY;
var book = 'YOUR BOOK SLUG';

var leanpub = new Leanpub(apikey);

leanpub.sales({ slug: book, report: 'summary' }, function(err, res){
  console.log(res.total_book_royalties);
});

leanpub.sales({ slug: book, report: 'all' }, function(err, res){
  console.log(res);
});

var status = leanpub.status({ slug: book }, function(err, res){
  console.log('this is probably unnecessary')
});

status.on('response', function(currentStatus, oh){
  console.log('yeah', currentStatus.num, oh);
});

status.on('done', function(res){
  console.log('not processing', res)
});
```

## methods

**leanpub.preview(options, callback)**
- slug (string, required, the slug of your book)
- subset (boolean, to generate a subset of your book based on the Preview.txt file)

**leanpub.publish(options, callback)**
options:
- slug (string, required, the slug of your book)
- emailReaders (boolean, required if you want to add release notes)
- releaseNotes (string, the release notes that will be emailed to readers)

**leanpub.status(options, callback)**
options:
- slug (string, required, the slug of your book)
- poll (boolean, default true. set to false if you don't want to poll leanpub to check for when the book finishes generating)

returns an event emitter with 'response' event that returns information about the book's status in the process of being generated, and a 'done' event, when the book is no longer in the process of generating.

if `poll` is true, the response event will fire every 10 seconds until the book is done generating.

**leanpub.sales(options, callback)**
options:
- slug (string, required, the slug of your book)
- report (string, required, can be 'summary', to get a summary of your sales, or 'all', to get a list of all purchases **TODO:** allow paging through results)

## license
MIT