var _KEYBOARD_ACTIONS = {
  65:  'rotate-left',   // a
  83:  'rotate-right',  // s
  37:  'left',          // ←
  39:  'right',         // →
  40:  'down',          // ↓
  32:  'pause',         // space
  77:  'toggle-music',  // m
  72:  'toggle-help',   // h
  191: 'toggle-instruction' // /
};

var HumanPlayer = function() {
  var self = this;
  window.addEventListener('keydown', function(e) {
    action = _KEYBOARD_ACTIONS[e.keyCode];
    action && self.trigger(action);
  })
}

 _.extend(HumanPlayer.prototype, Backbone.Events, {
  tick: function() {}
 });
