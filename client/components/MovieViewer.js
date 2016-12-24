var m = require('mithril');
var Movie = require('../models/movie');

var MovieViewer = module.exports;

MovieViewer.controller = function () {
  var ctrl = this;

  ctrl.movie = null;
  ctrl.searchMovie = function(formGroup){
    Movie.fetch(ctrl.movie)
      .then(function(movieLink){
        if(typeof movieLink === "string" && movieLink.slice(0,5) === 'Error'){
          // change background of textBox to red
          //formGroup.style = "form-group has-error";
          ctrl.movie = 'Error';
          //console.log('stuff');
        } else {
           console.log(movieLink);
           window.location.href = movieLink;
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
  ])
}
