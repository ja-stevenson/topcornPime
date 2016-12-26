var m = require('mithril');
var Tv = require('../models/tv');
var Movie = require('../models/movie');

var TVViewer = module.exports;
// https://repl.it/Eqgd/5

TVViewer.controller = function () {
  var ctrl = this;
  ctrl.tvShow = null;
  ctrl.tvShows = [];
  ctrl.tvShowList = [];
  ctrl.showName;
  ctrl.show;
  ctrl.playEpisode = function(link){
    Movie.fetch(link)
      .then(function(movieLink){
        console.log(movieLink);
        window.location.href = movieLink;
         /*
         if(typeof movieLink === "string" && movieLink.slice(0,5) === 'Error'){
          // change background of textBox to red
          //formGroup.style = "form-group has-error";
          ctrl.tvShow = 'Error';
        } else {
           console.log(movieLink);
           window.location.href = movieLink;
        }
        */
      })
  };
  ctrl.findShow = function(showLink){
    Tv.fetch(showLink)
      .then(function(seasonObj){
        if(typeof seasonObj === 'string' &&   seasonObj.slice(0,5) === 'Error'){
            ctrl.tvShow = seasonObj;
        } else {
          ctrl.showName = seasonObj.showName;
          console.log(seasonObj);
          ctrl.tvShows = seasonObj.data.slice(1);
          ctrl.tvShowList = [];
        }
      })
  };
  ctrl.searchShow = function(){
    console.log("show is: ", ctrl.tvShow);
    Tv.search(ctrl.tvShow)
      .then(function(showList){
        if(typeof showList === 'string' &&   showList.slice(0,5) === 'Error'){
            ctrl.tvShowList = showList;
        } else {
          console.log(showList);
          ctrl.tvShowList = showList.data;
        }
      })
  };
}

TVViewer.view = function (ctrl) {
  return m('.auth-panel', [    
    m('form.form-group', 
      { onsubmit: function(e){ 
        e.preventDefault();
        ctrl.searchShow();
      } 
    }, 
    [
      m('input[type=text][name=tvshow][placeholder=Please type in a TV show...].form-control', {
        value: ctrl.tvShow,
        oninput: function (episode) { 
          if(this.value.slice(0,5) === 'Error' && this.value.length > 5){
            ctrl.tvShow = this.value.slice(-1);
          } else {
            ctrl.tvShow = this.value;
          }
          ctrl.tvShows = [];

        },
        
      }),
    ]),
    m('button.btn', { class: "btn-primary btn-lg", onclick: ctrl.searchShow }, "Search TV Show"),
    m('.shows-list', [
      ctrl.tvShowList.map(function(series) {
        // console.log('series is: ');
        var link = series.substring(series.indexOf('-')+1, series.indexOf('-tvshow-online-free-putlocker.html" title='));
        var name = series.substring(series.indexOf('title="')+7, series.indexOf('"><img'));
        var img = series.substring(series.indexOf('src="')+5, series.indexOf('" border'));
        console.log('the link is: ', link)
        return m('.links', [
          // m("svg[height='200px'][width='200px']", [
          //   m('image[href="' + img + '"][height="200px"][width="200px"]')
          // ]),
          m('button.btn.btn-link', { onclick: ctrl.findShow.bind(null, link) }, name),
        ])
      })
    ]),
    m('.show-list', [
      ctrl.tvShows.map(function(seasons) {
        // console.log(seasons);
        // <select> tag (dropdown) code below
        // 
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
        // 
        // link style below
        return m('.season', [
          m('h3', ctrl.showName + ' ' + seasons.seasons.name),
          m('.episodes', [
            seasons.seasons.episodes.map(function(episode){
              var epNum = episode.substring(episode.indexOf('Episode '), episode.indexOf(' - '));
              var link = episode.substring(episode.indexOf('-')+1, episode.indexOf('-online-free-putlocker.html" title='));
              var name = episode.substring(episode.indexOf(' - ')+3, episode.indexOf('"><strong>Episode'));
              return m('.links', [
                m('button.btn.btn-link', { onclick: ctrl.playEpisode.bind(null, link) }, epNum + ': ' + name),
              ])
            })
          ])
        ])
      })      
    ])
  ])
}
