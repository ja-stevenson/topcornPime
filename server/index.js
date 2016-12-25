var express = require('express');
var browserify = require('browserify-middleware');
var bodyParser = require('body-parser');
var request = require('request');
var path = require('path');
var getPlUrl = require('./model/url');
var helpers = require('./model/helpers');

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

app.get('/movieSearch/*', function(req, res){
  var movieName = helpers.formatter(req.url);
  var url = getPlUrl(movieName)[0];
  var theUrl = 'http://putlockers.ch/search/advanced_search.php?section=0&q=' + movieName;
  request(theUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) { 
      var html = body;
      var firstSlice = html.substring(html.indexOf('<input type="hidden" name="genre[]" value="0"></form>')+ 277);
      var secondSlice = firstSlice.substring(0,firstSlice.indexOf('</table><p />'));
      var movieOptions = secondSlice.split('</tr>\n<tr>\n').join('').split('<a href="');
      var choiceMovies = helpers.movieListBuilder(movieOptions);
      if(choiceMovies.length){
        res.send({data: choiceMovies});
      } else {
        res.send({error: 'No movies match your search criteria'});
      }
    }
  })
})

app.get('/movieLink/*', function(req, res){
  var movieName = helpers.formatter(req.url);
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
          if (body1 !== 'File was deleted' || body1.length > 100){
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
              res.end({error: 'Parse Error. inform your homies a fix is needed.'});
            }
            console.log("this is it:", mediaFile.file)
            res.send(JSON.stringify(mediaFile.file));
          } else {
            res.send({error: 'File deleted most likely.'});
          }
        } else {
          res.send({error: 'Parse Error. Inform your homies a fix is needed'});
        }
      });
    } else {
      res.send({error: 'Movie not found. Check exact title "the" , "a",etc'});
    }
  })
});

app.get('/tvShow/*', function(req,res){
  var showName = decodeURI(req.url) + ' tvshow';
  showName = helpers.formatter(showName);
  var url = getPlUrl(showName)[0] ;
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) { 
      var html = body;
      var firstSlice = html.substring(html.indexOf('<h2 style="color:green;margin-bottom:0px !important;border-top:1px solid silver;padding:5px;background-color:beige;"><a class="selector_name" href=')+147);
      var secondSlice = firstSlice.substring(0,firstSlice.indexOf('<h2 style="color:green;margin-bottom:0px !important;border-top:1px solid silver;padding:5px;background-color:beige;"><strong>'));
      var whatINeed = secondSlice.split('<strong>Season ');
      var allTheSeasons = helpers.seasonBuilder(whatINeed);
      res.send(200, {
        seasonCount: secondSlice.split('<strong>Season ').length - 1,
        showName: showName.substring(0, showName.indexOf(" tvshow")).toUpperCase(),
        data: allTheSeasons
      });
    } else {
      res.send({error: 'TV Show not found.'});
    }
  })
});

//        Start the server on PORT 3003
app.listen(3003, function(){
  console.log('Express app listening on port 3003');
});