module.exports = {
  formatter: function(input){
    var movieName = decodeURI(input);
    movieName = movieName.substring(movieName.lastIndexOf('/')).slice(1);
    if (movieName.includes('?')){
      movieName = movieName.substring(0,movieName.lastIndexOf('?'));
    }
    return movieName;
  },
  seasonBuilder: function(input){
    var allTheSeasons = []
    input.map(function(seasons){  
      var someSeason = {};
      someSeason.seasons = {};
      var seasonName = 'Season '+ seasons.substring(0,seasons.indexOf('<'));
      var season = seasons.split('<td width="100%" class="entry"><a href=').slice(1);
      someSeason.seasons.name = seasonName;
      someSeason.seasons.episodes = season;
      season.forEach(function(episodes){
        var episodesArray = episodes.split('</td></tr><tr><td class="entry"><img src="http://putlockers.ch/images/bullet.gif" border="0"></td><td width="100%" class="entry">')
        episodesArray.forEach(function(episode){
          var epName = episode.substring(episode.indexOf('title="')+7, episode.indexOf('"><strong>'))
          var theLink = episode.substring(episode.indexOf('http'), episode.indexOf('" title'));
          someSeason.seasons.episodes[epName] = theLink
        })
      })
      allTheSeasons.push(someSeason);
    })
    return allTheSeasons;
  },
  movieListBuilder: function(movieOptions){
    var choiceMovies = [];
    for(var i = 0; i < movieOptions.length; i++){
      if(i % 2 && !movieOptions[i].includes('tvshow-online-free')){
        choiceMovies.push(movieOptions[i]);
      }
    }
    return choiceMovies;
  },
  tvListBuilder: function(movieOptions){
    var choiceMovies = [];
    for(var i = 0; i < movieOptions.length; i++){
      if(i % 2 && movieOptions[i].includes('tvshow-online-free')){
        choiceMovies.push(movieOptions[i]);
      }
    }
    return choiceMovies;
  }
}