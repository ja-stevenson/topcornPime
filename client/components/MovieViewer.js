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
        // console.log(movieLink);
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
        // console.log(movieList);
        if(typeof movieList === "string"){
          // change background of textBox to red
          ctrl.movie = movieList;
        } else {
          ctrl.movieList = sortByYear(movieList.data);
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
      m('br'),
      m('button.btn', { class: "btn-primary btn-lg", type: "submit"}, "Search Movie"),
    ]),
    m('.movie-list', [
      ctrl.movieList.map(function(movie) {
        var link = movie.substring(movie.indexOf('-')+1, movie.indexOf('title=')-29);
        var name = movie.substring(movie.indexOf('title="')+7, movie.indexOf('"><img'));
        var img = movie.substring(movie.indexOf('src="')+5, movie.indexOf('" border'));
        var year = name.substring(name.lastIndexOf('(')+1, name.lastIndexOf(')'));
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

function sortByYear(movieList){
  return movieList.sort(function(a,b){
    var yearAsub = a.substring(a.indexOf('title="')+7, a.indexOf('"><img'));
    var yearBsub = b.substring(b.indexOf('title="')+7, b.indexOf('"><img'));
    var yearA = Number(yearAsub.substring(yearAsub.lastIndexOf('(')+1, yearAsub.lastIndexOf(')')));
    var yearB = Number(yearBsub.substring(yearBsub.lastIndexOf('(')+1, yearBsub.lastIndexOf(')')));
    // console.log('yearA is: ', yearA, 'and yearB is: ', yearB);
    if (yearB < yearA){
      return 1;
    } else {
      return -1;
    }
  })
}
