// ok, here you have 3 objects
// this.board - game board, NxM matrix, each element can be:
// empty - null
// virus - {
//   type: 'virus',
//   color: 'red' / 'green' / 'blue'
// }
// half pill - {
//   type: 'pill',
//   color: 'red' / 'green' / 'blue'
// }
// full pill - {
//   type 'pill',
//   color: 'red' / 'green' / 'blue'
//   part: {
//     x: integer,  # x/y coordinates for other part of pill
//     y: integer,
//     color: 'red' / 'green' / 'blue'
//   }
// }
//
//
//  this.pill - new pill
//  [
//     { x: integer, y: integer, color: string },
//     { x: integer, y: integer, color: string }
//  ]
//
// this.moves - all possible positions of pill
// Array of position objects.
// [
//   [{x: integer, y: integer}, {x: integer, y: integer}],
//   ...
// ]
//
// bot should return one position object
// {x: integer, y: integer}

var findVscore = function(column, color1, color2) {
  var scores = {}
  if (color1 == color2) {
    if (column.color == color1 ) {
      scores.base = 50;
      scores.y = column.y * -2;
      scores.height = (column.height + 1) * 20
      if (column.virus) {
        scores.virus = 50;
      }
    } else if (column.virus) {
      scores.virus = -50;
    } else if (column.color) {
      scores.base = -20;
    }
  } else {
    if (column.color == color1 && column.height >=3 ) {
      scores.base = 50;
      scores.y = column.y * -2;
      scores.height = column.height * 20;
      if (column.virus) {
        scores.virus = 50;
      }
    } else if (column.virus) {
      scores.virus = -50;
    } else if (column.color) {
      scores.base = -20;
    }
  }
  var total = 0;
  for (key in scores) {
    total += scores[key];
  }

  return { total: total, details: scores }
}

var findScore = function(column, color) {
  var scores = {};
  if (column.color == color) {
    scores.base = 50;
    scores.y = column.y * -2;
    scores.height = column.height * 20;
    if (column.virus) {
      scores.virus = 50;
    }
  } else if (column.virus) {
    scores.virus = -50;
  } else if (column.color) {
    scores.base = -20;
  }

  var total = 0;
  for (key in scores) {
    total += scores[key];
  }

  return { total: total, detail: scores }
}

var findVariants = function(columns, color1, color2) {
  variants = [];

  for (x = 0; x < columns.length; x++) {
    var column = columns[x];
    var self = this;

    _.each(column.open, function(v) {
      if (v == 'left' || v == 'right') {
        var nextColumn = columns[x + (v == 'left' ? -1 : 1 )];
        var base = findScore(column, color1);
        var add  = findScore(nextColumn, color2);
        var score = base.total + add.total;
        var variant = {
          x: x,
          score: score,
          direction: v,
          color: color1,
          details: [base.detail, add.detail]
        };
        variants.push(variant);
      } else {
        var base = findVscore(column, color1, color2);
        variant = {
          x: x,
          score: base.total,
          direction: v,
          color: color1,
          details: base.details
        };
        variants.push(variant);
      }
    })
  }
  return variants;
}

var columns = new Array(this.board.length);
for (var x = 0; x < this.board.length; x++) {
  for (var y = 0; y < this.board[x].length; y++) {

    var cell, color = null, virus = false;

    if (cell = this.board[x][y]) {
      virus = cell.type == 'virus';
      color = cell.color;
    }

    if (color && !columns[x]) {
      columns[x] = {
        virus: virus,
        color: color,
        y: y,
        height: 1
      }
    }

    if (color && columns[x]) {
      if (color == columns[x].color) {
        columns[x].height = y - columns[x].y + 1;
        columns[x].virus = columns[x].virus || virus;
      } else {
        break;
      }
    }

    if (!color && columns[x]) {
      break;
    }
  }

  if (!columns[x]) {
    columns[x] = { y : this.board[x].length };
  }
}

for (var x = 0; x < columns.length; x++) {
  var left  = columns[x-1] && columns[x-1].y >= columns[x].y;
  var right = columns[x+1] && columns[x+1].y >= columns[x].y

  var s;
  if (left && right) {
    s = ['left', 'right', 'top'];
  } else if (left) {
    s = ['left', 'top'];
  } else if (right) {
    s = ['right', 'top'];
  } else {
    s = ['top'];
  }

  columns[x].open = s;
}

var colors = [this.pill[0].color, this.pill[1].color];

var variants = findVariants(columns, colors[0], colors[1]);
if (colors[0] != colors[1]) {
  variants = variants.concat(findVariants(columns, colors[1], colors[0]));
}

variants = _.sortBy(variants, function(v) {return v.score; });
var variant = variants.reverse()[0];

var firstPart = this.pill[0].color == variant.color;

var x1, x2, y1, y2, move;

x1 = variant.x;
y1 = 1;

switch (variant.direction) {
case 'top':
  x2 = x1;
  y2 = 0;
  break;
case 'left':
  x2 = x1 - 1;
  y2 = 1;
  break;
case 'right':
  x2 = x1 + 1;
  y2 = 1;
  break;
}

if (firstPart) {
  move = [{x: x1, y: y1}, {x: x2, y: y2}];
} else {
  move = [{x: x2, y: y2}, {x: x1, y: y1}];
}

return move;