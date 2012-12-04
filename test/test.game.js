var assert = require("assert");
var Board  = require(__dirname + "/../public/javascripts/board.js").Board;
var Pill   = require(__dirname + "/../public/javascripts/pill.js").Pill;
var Game   = require(__dirname + "/../public/javascripts/game.js").Game;
var _      = require(__dirname + "/../public/javascripts/lib/underscore.js");


console.log(Game);


describe('Game', function(){
  it('Clears a row', function(){
    var game  = new Game();
    var pill1 = new Pill(game.board, game.detector, [ {x : 0 , y : 0 }, {x : 1, y : 0 } ],["red", "red"]);
    var pill2 = new Pill(game.board, game.detector, [ {x : 2 , y : 0 }, {x : 3, y : 0 } ],["red", "red"]);

    // should find 1 match because pill1 & pill2
    assert.equal(game.board.matches().length, 1);
    
    // "Should Find 0 Matches after clear"
    game.findMatches(function(){});
    assert.equal(game.board.matches().length, 0);
  })
})


