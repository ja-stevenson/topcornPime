const expect  = require('chai').expect;
const request = require('supertest-as-promised');

const decoder = require('../decoderRing.js');
const helpers = require('../model/helpers.js');
const plUrl   = require('../model/url.js');

const app     = require('../index.js');

//Tests start here...

describe('', function() {

  describe('Movie searching:', function() {

    it('Returns a proper error when an invalid movie name is requested', function() {
      return request(app)
        .get('/movieSearch/steveandthebanditofcorlane')
        .expect(200)
        .expect(function (res) {
          expect(res.body.error).to.equal('No movies match your search criteria');
        })
    });

    it('Returns a list of movies if a match is found', function() {
      return request(app)
        .get('/movieSearch/taken')
        .expect(200)
        .expect(function (res) {
          expect(res.body.data.length).to.equal(10);
        })
    });

    it('Responds with the correct link when a movie is clicked', function() {
      return request(app)
        .get('/movieLink/taken 2')
        .expect(200)
        .expect(function (res) {
          expect(res.text.includes('http://')).to.equal(true);
        })
    });
  })

  describe('TV searching:', function() {

    it('Returns a proper error when an invalid tvShow is requested', function() {
      return request(app)
        .get('/tvSearch/steveandthebanditofcorlane')
        .expect(200)
        .expect(function (res) {
          expect(res.body.error).to.equal('No shows match your search criteria');
        })
    });

    it('Returns a list of tv shows if a match is found', function() {
      return request(app)
        .get('/tvSearch/stranger things')
        .expect(200)
        .expect(function (res) {
          expect(res.body.data.length).to.equal(1);
        })
    });

    it('Responds with the list of episodes when a show is clicked', function() {
      return request(app)
        .get('/tvShow/game of thrones')
        .expect(200)
        .expect(function (res) {
          expect(res.body.seasonCount).to.equal(6);
        })
    });

    it('Responds with the correct link when an episode is clicked', function() {
      return request(app)
        .get('/movieLink/game-of-thrones-tvshow-season-1-episode-1')
        .expect(200)
        .expect(function (res) {
          expect(res.text.includes('v.mp4')).to.equal(true);
        })
    });
  })
})