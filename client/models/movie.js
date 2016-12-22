var m = require('mithril');


var Movie = module.exports;

Movie.fetch = function(movieName) {
  return m.request({ 
    method: 'GET', 
    url: 'http://localhost:3003/movieLink/' + movieName
  });
}
