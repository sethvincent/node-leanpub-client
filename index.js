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

Leanpub.prototype.preview = function preview(options, callback){
  var url = this.url + options.slug;
  url += options.subset ? '/preview/subset.json' : '/preview.json';
  
  this.post(url, options, callback);
};


/*
*
* PUBLISH
*
*/

Leanpub.prototype.publish = function publish(options, callback){
  var url = this.url + options.slug + '/publish.json';
  var publishOptions = {};

  if (options.emailReaders){
    publishOptions['publish[email_readers]'] = true;
  }

  if (options.releaseNotes){
    publishOptions['publish[release_notes]'] = options.releaseNotes;
  }

  this.post(url, publishOptions, callback);
};


/*
*
* JOB STATUS
*
*/

Leanpub.prototype.status = function status(options, callback){
  var self = this;

  var url = this.url + options.slug + '/book_status.json';
  var ee = new EventEmitter;
  var poller, poll;

  if (options.poll === 'undefined'){
    poll = true;
  } else {
    poll = options.poll;
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
          self.status({slug: options.slug, poll: false }, 
            function(err, res){
            
              if (res.num) { 
                ee.emit('response', res);
              } else {
                clearInterval(poller);
                ee.emit('done', res);
              }
              
            }
          );
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

Leanpub.prototype.sales = function(options, callback){
  var url;

  if (options.report === 'summary'){
    url = this.url + options.slug + '/sales.json';
  } else if (options.report === 'all'){
    url = this.url + options.slug + '/individual_purchases.json';
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