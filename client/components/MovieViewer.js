var m = require('mithril');
var Movie = require('../models/movie');

var MovieViewer = module.exports;

MovieViewer.controller = function () {
  var ctrl = this;

  ctrl.movie = null;
  ctrl.searchMovie = function(){
    Movie.fetch(ctrl.movie)
      .then(function(movieLink){
        console.log(movieLink);
        window.location.href = movieLink;
      })
  };
}

MovieViewer.view = function (ctrl) {
  return m('.auth-panel', [

    m('form', 
      { onsubmit: function(e){ 
        e.preventDefault();
      } 
    }, 
    [
      m('input[type=text][name=moviename]', {
        value: ctrl.movie,
        oninput: function (e) { ctrl.movie = this.value }
      }),
    ]),
    m('button', { onclick: ctrl.searchMovie }, "Search Movie"),
  ])
}
