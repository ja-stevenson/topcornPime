// Require language extensions BEFORE anything else
require('../ext');
window.m = require('mithril');

var MovieViewer = require('./components/MovieViewer');
var TVViewer = require('./components/TVViewer');

var movieDisplay = localStorage.getItem('display') === 'movie' ? MovieViewer : TVViewer;

m.route(document.getElementById('app'), '/', {

  '/': {
    view: function () {
      return [
        [
          m('div.page-header', {style: "text-align:center;"}, [
              m('h1', "Topcorn Pime")
            ])         
        ],
        [
          m('button.btn', {
            onclick: function(){displayTV()},
            class: "btn-primary btn-success", 
            type: "submit"
          }, "Watch Tv"),
          m('button.btn', {
            onclick: function(){displayMovie()},
            class: "moviebutton btn-primary", 
            type: "submit"
          }, "Watch Movie"),
        ],
        movieDisplay
      ]
    }
  }
  
});

function displayTV(){
  localStorage.setItem('display', 'tv');
  movieDisplay = TVViewer;
}

function displayMovie(){
  localStorage.setItem('display', 'movie');
  movieDisplay = MovieViewer;
}
