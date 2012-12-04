var assert            = require("assert");
var Board             = require(__dirname + "/../public/javascripts/board.js");
var Pill              = require(__dirname + "/../public/javascripts/pill.js");
var _                 = require(__dirname + "/../public/javascripts/lib/underscore.js");

var width  = 10;
var height = 16;
var b      = new Board(width,height);

describe('Board', function(){
  describe('after creation', function(){
    it('should be empty', function(){
      var empty = true;
      b.eachSpot(function(spot,loc){
        if(!_.isUndefined(spot)){
          empty = false;
        }
      });
      assert.equal(true, empty);
    });

    it('should be defined', function(){
      assert.notEqual(b.board, undefined);
    });

    it('should have the correct width', function(){
      assert.equal(b.width, width);
    });

    it('height should match', function(){
      assert.equal(b.height, height);
    });
  });

  describe('bounds', function(){
    var in_bounds = true;
    for(var i = 0; i<width; ++i){
      for(var j = 0; j < height; ++j){
        if(in_bounds){
          in_bounds = b.inBounds(i,j);
        }
      }
    }

    it('should be inbounds', function(){
      assert.equal(in_bounds, true);
    })
    
    it('should not be inbounds', function(){
      assert.equal(b.inBounds(-1,0), false);
    })
    
    it('should not be inbounds', function(){
      assert.equal(b.inBounds(width,height), false);
    })
  })
})
