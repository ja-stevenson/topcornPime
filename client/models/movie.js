var m = require('mithril');


var Movie = module.exports;

Movie.fetch = function(movieName) {
  return m.request({ 
    method: 'GET', 
    url: 'http://localhost:3003/movieLink/' + movieName
  }).then(errorCheck => errorCheck.error ? `Error: ${errorCheck.error}`: errorCheck);
}

Movie.search = function(movieSearch) {
  return m.request({ 
    method: 'GET', 
    url: 'http://localhost:3003/movieSearch/' + movieSearch
  }).then(errorCheck => errorCheck.error ? `Error: ${errorCheck.error}`: errorCheck);
}