var m = require('mithril');
var Tv = require('../models/tv');
var Movie = require('../models/movie');

var TVViewer = module.exports;
// https://repl.it/Eqgd/5

TVViewer.controller = function () {
  var ctrl = this;

  ctrl.tvShow = null;
  ctrl.tvShows = [];
  ctrl.showName;
  ctrl.show;
  ctrl.playEpisode = function(link){
    Movie.fetch(link)
      .then(function(movieLink){
        console.log(movieLink);
        window.location.href = movieLink;
      })
  };
  ctrl.searchShow = function(){
    console.log("show is: ", ctrl.tvShow);
    Tv.fetch(ctrl.tvShow)
      .then(function(seasonObj){
        ctrl.showName = seasonObj.showName;
        console.log(seasonObj);
        ctrl.tvShows = seasonObj.data.slice(1);
      })
    // window.location.href = 'http://localhost:3003/' + ctrl.movie;
  };
}

TVViewer.view = function (ctrl) {
  return m('.auth-panel', [    
    m('form', 
      { onsubmit: function(e){ 
        e.preventDefault();
      } 
    }, 
    [
      m('input[type=text][name=tvshow]', {
        value: ctrl.tvShow,
        oninput: function (e) { ctrl.tvShow = this.value }
      }),
    ]),
    m('button', { onclick: ctrl.searchShow }, "Search TV Show"),
    m('.show-list', [
      ctrl.tvShows.map(function(seasons) {
        console.log(seasons);
        // return m('select', {
        //     className: seasons.seasons.name,
        //     onchange: ctrl.playEpisode.bind(null,this.value)
        //   },
        //   seasons.seasons.episodes.map(function(episode){
        //     var link = episode.substring(episode.indexOf('-')+1, episode.indexOf('-online-free-putlocker.html" title='));
        //     var name = episode.substring(episode.indexOf(' - ')+3, episode.indexOf('"><strong>Episode'));
        //     return m('option', {
        //       value: link
        //     }, name)
        //   })
        // )
        return m('.season', [
          m('h3', ctrl.showName + ' ' + seasons.seasons.name),
          m('.episodes', [
            seasons.seasons.episodes.map(function(episode){
              var link = episode.substring(episode.indexOf('-')+1, episode.indexOf('-online-free-putlocker.html" title='));
              var name = episode.substring(episode.indexOf(' - ')+3, episode.indexOf('"><strong>Episode'));
              console.log('name is:', name)
              return m('.links', [
                m('button', { onclick: ctrl.playEpisode.bind(null, link) }, name),
                m('br')
              ])
            })
          ])
        ])
      })      
    ])
  ])
}
