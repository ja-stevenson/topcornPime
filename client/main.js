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
          m('div.page-header', {style: "text-align:center;"}, [
              m('h1', "Topcorn Pime")
            ])
         
        ],
        MovieViewer,
        TVViewer
      ]
    }
  }
  
});
