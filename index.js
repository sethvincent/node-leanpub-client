var EventEmitter = require('events').EventEmitter;
var request = require('request');

module.exports = Leanpub;

function Leanpub(key){
  this.url = 'https://leanpub.com/';
  this.key = key;
}


/*
*
* PREVIEW
*
*/

Leanpub.prototype.preview = function preview(slug, options, callback){
  var url = this.url + slug;
  url += options.subset ? '/preview/subset.json' : '/preview.json';
  
  this.post(url, options, callback);
};


/*
*
* PUBLISH
*
*/

Leanpub.prototype.publish = function publish(slug, options, callback){
  var url = this.url + slug + '/publish.json';
  var publishOptions = {};

  if (options.emailReaders){
    publishOptions['publish[email_readers]'] = true;
  }

  if (optoins.releaseNotes){
    publishOptions['publish[release_notes]'] = options.releaseNotes;
  }

  this.post(url, publishOptions, callback);
};


/*
*
* JOB STATUS
*
*/

Leanpub.prototype.status = function status(slug, callback, poll){
  var self = this;

  var url = this.url + slug + '/book_status.json';
  var ee = new EventEmitter;
  var poller;

  if (typeof poll === 'undefined'){
    var poll = true;
  }

  this.get(url, function(err, res){

    if (res.num){
      ee.emit('response', res);
    }

    if (poll){
      if (!res.num){
        ee.emit('done', res);
      } else {
        poller = setInterval(function () {
          self.status(slug, function(err, res){
            
            if (res.num) { 
              ee.emit('response', res);
            } else {
              clearInterval(poller);
              ee.emit('done', res);
            }
            
          }, false);
        }, 10000);
      }
    }
    callback(err, res);
  });

  return ee;
};


/*
*
* SALES
*
*/

Leanpub.prototype.sales = function(slug, report, callback){
  var url;

  if (report === 'summary'){
    url = this.url + slug + '/sales.json';
  } else if (report === 'all'){
    url = this.url + slug + '/individual_purchases.json';
  } else {
    throw new Error;
  }

  this.get(url, callback);
}


/*
*
* HELPER METHODS
*
*/

/* GET */

Leanpub.prototype.get = function(url, callback){
  request.get(url, { form: { api_key: this.key } }, 
    function(err, res, body){
      callback(err, JSON.parse(body));
    }
  );
};

/* POST */

Leanpub.prototype.post = function(url, options, callback){
  options.api_key = this.key;

  request.post(url, { form: options }, 
    function(err, res, body){
      callback(err, JSON.parse(body));
    }
  );
};