var m = require('mithril');


var Tv = module.exports;

Tv.fetch = function(tvShow) {
  return m.request({ 
    method: 'GET', 
    url: 'http://localhost:3003/tvShow/' + tvShow
  }).then(errorCheck => errorCheck.error ? `Error: ${errorCheck.error}`: errorCheck);
}
