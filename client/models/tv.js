var m = require('mithril');


var Tv = module.exports;

Tv.fetch = function(tvShow) {
  return m.request({ 
    method: 'GET', 
    url: '/tvShow/' + tvShow
  }).then(errorCheck => errorCheck.error ? `Error: ${errorCheck.error}`: errorCheck);
};

Tv.search = function(tvShow) {
  return m.request({ 
    method: 'GET', 
    url: '/tvSearch/' + tvShow
  }).then(errorCheck => errorCheck.error ? `Error: ${errorCheck.error}`: errorCheck);
}
