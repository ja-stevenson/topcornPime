var m = require('mithril');
var Movie = require('../models/movie');

var MovieViewer = module.exports;

MovieViewer.controller = function () {
  var ctrl = this;

  ctrl.movie = null;
  ctrl.movieList = [];

  ctrl.playMovie = function(movieName){
    Movie.fetch(movieName)
      .then(function(movieLink){
        if(typeof movieLink === "string" && movieLink.slice(0,5) === 'Error'){
          ctrl.movie = movieLink;
        } else {
           window.location.href = movieLink;
        }
      })
  };

  ctrl.searchMovie = function(formGroup){
    Movie.search(ctrl.movie)
      .then(function(movieList){
        if(typeof movieList === "string"){
          // change background of textBox to red
          ctrl.movie = movieList;
        } else {
          ctrl.movieList = movieList.data;
        }
      })
  };
}

MovieViewer.view = function (ctrl) {
  return m('.auth-panel', [

    m('form.form-group', 
      { 
        onsubmit: function(e){ 
          e.preventDefault();
          ctrl.searchMovie(e.target);
      } 
    }, 
    [
      m('input[type=text][name=moviename][placeholder=Please type in a movie to watch...].form-control', {
        value: ctrl.movie,
        oninput: function (e) { 
          if(this.value.slice(0,5) === 'Error' && this.value.length > 5){
            this.value = this.value.slice(-1);
          }
          ctrl.movie = this.value;
          ctrl.textBox = this;
          this.style.backgroundColor = '#fff';
        },
        onfocus: function(e) {
          if(this.value === 'Error'){
            this.value = '';
          }
        },
        onclick: function(e) {
          this.value.slice(0,5) === 'Error'
            ? this.value = '' : true;
        }
      }),
    ]),
    m('button.btn', { class: "btn-primary btn-lg", onclick: ctrl.searchMovie }, "Search Movie"),
    m('.movie-list', [
      ctrl.movieList.map(function(movie) {
        var link = movie.substring(movie.indexOf('-')+1, movie.indexOf('-online-free-putlocker.html" title='));
        var name = movie.substring(movie.indexOf('title="')+7, movie.indexOf('"><img'));
        var img = movie.substring(movie.indexOf('src="')+5, movie.indexOf('" border'));
        return m('.links', [
          // m("svg[height='200px'][width='200px']", [
          //   m('image[href="' + img + '"][height="200px"][width="200px"]')
          // ]),
          m('button.btn.btn-link', { onclick: ctrl.playMovie.bind(null, link) }, name),
        ])
      })
    ])
  ])
}      

