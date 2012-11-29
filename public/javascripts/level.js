const SPEED_VEL = {'low': 600, 'med': 400, 'hi': 300};
const POINTS    = {'low': 100, 'med': 200, 'hi': 300};

function Level(n, s) {
  this.number = n;
  this.speed  = s;
}

Level.prototype.velocity = function() {
  return SPEED_VEL[this.speed.toLowerCase()];
}

Level.prototype.virus_score = function(){
  return POINTS[this.speed.toLowerCase()];
}