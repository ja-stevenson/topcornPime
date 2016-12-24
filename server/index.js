var express = require('express');
var browserify = require('browserify-middleware');
var bodyParser = require('body-parser');
var request = require('request');
var path = require('path');
var getPlUrl = require('./model/url');

var app = express();
app.get('/scripts/app-bundle.js', 
  browserify('./client/main.js'));
module.exports = app;

app.use(express.static('client/public'));
var decodeDoIt = require('./decoderRing');


app.use( bodyParser.json() );      // Parse JSON request body
app.use( bodyParser.urlencoded({ extended: true }) );


//        Static routes for serving up /client files
app.use(express.static(path.join(__dirname, '../client')));

app.get('/movieLink/*', function(req,res){
  
  var movieName = decodeURI(req.url);
  // console.log("does this work?", movieName);
  movieName = movieName.substring(movieName.lastIndexOf('/')).slice(1);
  if (movieName.includes('?')){
    movieName = movieName.substring(0,movieName.lastIndexOf('?'));
  }
  var url = getPlUrl(movieName)[0];
  console.log(url);
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) { 
      var html = body;
      var firstSlice = html.substring(html.lastIndexOf('doit(')+6);
      var secondSlice = firstSlice.substring(0,firstSlice.indexOf(')'));
      var decodedHtml = decodeDoIt(secondSlice);
      //console.log(decodedHtml);
      var startIndex = decodedHtml.indexOf('src="')+5;
      var endIndex = decodedHtml.indexOf('" webkitAllow');
      var secondUrl = decodedHtml.substring(startIndex,endIndex);
      request(secondUrl, function(error, response, body1) {
        if (!error && response.statusCode == 200) {
          var secondHTML = body1;
          console.log(body1,body1.length);
          if (body1 != 'File was deleted' || body1.length > 100){
            var thirdSlice = secondHTML.substring(secondHTML.indexOf('sources: [')+9);
            var fourthSlice = thirdSlice.substring(0,thirdSlice.indexOf(']')+1);
            console.log('4th',fourthSlice);
            var sourceArray = eval(fourthSlice);
            console.log(sourceArray);
            var mediaFile = sourceArray.find(x=>x.label=="720p");
            if (mediaFile === undefined){
              mediaFile = sourceArray.find(x=>x.label=="360p");
            }
            if (mediaFile === undefined){
              mediaFile = sourceArray.find(x=>x.label=="240p");
            }
            if (mediaFile === undefined){
              res.end('error1');
            }
            console.log("this is it:", mediaFile.file)
            res.send(JSON.stringify(mediaFile.file));
          } else {
            res.send('error2');
          }
        } else {
          res.send('error3');
        }
      });
    } else {
      res.send('error4');
    }
  })
});

app.get('/tvShow/*', function(req,res){
  
  var showName = decodeURI(req.url) + ' tvshow';
  // console.log("does this work?", showName);
  showName = showName.substring(showName.lastIndexOf('/')).slice(1);
  if (showName.includes('?')){
    showName = showName.substring(0,showName.lastIndexOf('?'));
  }
  var url = getPlUrl(showName)[0] ;
  console.log(url);
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) { 
      var html = body;
      // console.log('the html is:', html);
      var firstSlice = html.substring(html.indexOf('<h2 style="color:green;margin-bottom:0px !important;border-top:1px solid silver;padding:5px;background-color:beige;"><a class="selector_name" href=')+147);
      var secondSlice = firstSlice.substring(0,firstSlice.indexOf('<h2 style="color:green;margin-bottom:0px !important;border-top:1px solid silver;padding:5px;background-color:beige;"><strong>'));
      var whatINeed = secondSlice.split('<strong>Season ');
      var allTheSeasons = []
      whatINeed.map(function(seasons){  
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
      res.send(200, {
        seasonCount: secondSlice.split('<strong>Season ').length - 1,
        showName: showName.substring(0, showName.indexOf(" tvshow")).toUpperCase(),
        data: allTheSeasons
      });
    } else {
      res.send('error4');
    }
  })
});

//        Start the server on PORT 3003
app.listen(3003, function(){
  console.log('Express app listening on port 3003');
});
