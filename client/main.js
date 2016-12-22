// Require language extensions BEFORE anything else
require('../ext');
window.m = require('mithril');

var MovieViewer = require('./components/MovieViewer');
var TVViewer = require('./components/TVViewer');

m.route(document.getElementById('app'), '/', {

  '/': {
    view: function () {
      return [
        [
          m('h1', "Welcome to Topcorn Pime.")
        ],
        [
          m('h3', "Please type in a movie to watch")
        ],
        MovieViewer,
        [
          m('h3', "Or find a tv show to watch below")
        ],

        TVViewer
      ]
    }
  }
  
});
