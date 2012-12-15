var _ACTIONS = ['left', 'right', 'rotate-left', 'rotate-right'];

var ComputerPlayer = function(game) {
  this.game = game;
  this.evalCode = _.bind(this.evalCode, this);

  var self = this;

  $(window).on('keydown', function(e) {
    if (e.keyCode == 32) {
      self.trigger('pause');
    }
  });
};

_.extend(ComputerPlayer.prototype, Backbone.Events, {
  tick: function (isNewPill) {
    if (!isNewPill) {
      return;
    }

    //setup pill object

    var _pill = this.game.getPill();

    this.pill = [
      { x: _pill.position[0].x, y: _pill.position[0].y, color: _pill.colors[0] },
      { x: _pill.position[1].x, y: _pill.position[1].y, color: _pill.colors[1] },
    ]

    // setup board object

    var _board = this.game.getBoard();
    this.board = [];

    for (var i = 0; i < _board.length; i++) {
      var _column = _board[i];
      this.board[i] = [];
      for (var j = 0; j < _column.length; j++) {
        // ignore active pill
        if ((i == this.pill[0].x && j == this.pill[0].y) ||
          ( i ==  this.pill[1].x && j == this.pill[1].y)) {
          continue;
        }

        var _cell = _column[j];
        if (_cell && _cell.pill.type == 'Virus') {
          this.board[i][j] = {
            type: 'virus',
            color: _cell.pill.color
          }
        } else if (_cell && _cell.pill.type == 'pill') {
          var pos = _cell.pos;
          this.board[i][j] = {
            type: 'pill',
            color: _cell.pill.colors[pos]
          }
          if (_cell.pill.position[1-pos]) {
            this.board[i][j].part = {
              x: _cell.pill.position[1-pos].x,
              y: _cell.pill.position[1-pos].y,
              color: _cell.pill.colors[1-pos]
            }
          }
        } else {
          this.board[i][j] = null;
        }
      }
    }


    var actions = this.code() || [];
    var self = this;
    var fire = function(actions) {
      if (actions.length > 0) {
        var next = actions.pop();
        self.trigger(next);
        setTimeout(function() {fire(actions)}, 150);
      }
    }

    fire(actions.reverse());
  },

  loadCode: function(code) {
    var self = this;
    var isGist = code.match(/^https:\/\/gist.github.com\/(\w+)/);
    if (isGist) {
      var url = 'https://gist.github.com/' + isGist[1] + '.json';
      $.ajax({
        url: url,
        dataType: 'jsonp',
        success: function(r) {
          var raw = r.div;
          var re = /<div class='line' id='\w+'>.*?<\/div>/g;
          var result = raw.match(re);
          var code = ''
          _.each(result, function(line) {
            code += $(line).text() + "\n";
          });
          self.evalCode(code);
          self.trigger('ready');
        }
      });
    } else {
      self.evalCode(code);
      self.trigger('ready');
    }
  },

  evalCode: function(code) {
    code = "this.code = function() {" + code + "};";
    eval(code);
  }
});
