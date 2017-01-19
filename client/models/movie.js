var m = require('mithril');

var Movie = module.exports;

Movie.fetch = function(movieName) {
  return m.request({ 
    method: 'GET', 
    url: '/movieLink/' + movieName
  }).then(errorCheck => errorCheck.error ? `Error: ${errorCheck.error}`: errorCheck);
}

Movie.search = function(movieSearch) {
  return m.request({ 
    method: 'GET', 
    url: '/movieSearch/' + movieSearch
  }).then(errorCheck => errorCheck.error ? `Error: ${errorCheck.error}`: errorCheck);
}