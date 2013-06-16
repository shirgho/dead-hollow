// Generated by CoffeeScript 1.4.0

/*

Control CoffeeScript class.
Handles keyboard and touch events.

@author: Marcin Wieprzkowicz (marcin.wieprzkowicz@gmail.com)
*/


(function() {
  var Control,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Control = (function(_super) {

    __extends(Control, _super);

    Control.prototype.defaults = {
      touchItems: '.touch',
      controls: {
        backward: '.control .backward',
        forward: '.control .forward',
        buttonB: '.control .buttonB',
        buttonA: '.control .buttonA',
        pause: '.control.pause a'
      }
    };

    function Control(options, game, map) {
      this.game = game;
      this.map = map;
      Control.__super__.constructor.apply(this, arguments);
      this.touchItems = document.querySelectorAll(this.options.touchItems);
      this.controls = {
        backward: document.querySelector(this.options.controls.backward),
        forward: document.querySelector(this.options.controls.forward),
        buttonB: document.querySelector(this.options.controls.buttonB),
        buttonA: document.querySelector(this.options.controls.buttonA),
        pause: document.querySelector(this.options.controls.pause)
      };
    }

    Control.prototype.addKeyboardEvents = function() {
      var movements,
        _this = this;
      movements = [
        {
          keys: 'right',
          on_keydown: function() {
            var interval;
            _this.controls.forward.classList.add('touched');
            _this.controls.backward.classList.remove('touched');
            if (!_this.game.paused) {
              _this.map.clearAnimation('right');
              _this.map.clearAnimation('left');
              interval = setInterval(function() {
                var collision;
                collision = _this.map.collision.checkAll(_this.map.objs.character.domEl, null, -_this.map.options.animation.shift, 0);
                if (!collision.status && !_this.map.animations.right.stopped) {
                  return _this.map.move(-_this.map.options.animation.shift, 0);
                }
              }, _this.map.options.animation.duration);
              _this.map.animations.right.interval = interval;
              return _this.map.objs.character.move();
            }
          },
          on_keyup: function() {
            _this.controls.forward.classList.remove('touched');
            _this.map.clearAnimation('right');
            if (_this.map.animations.left.interval == null) {
              return _this.map.objs.character.stop('run');
            }
          },
          prevent_repeat: true,
          prevent_default: true
        }, {
          keys: 'left',
          on_keydown: function() {
            var interval;
            _this.controls.backward.classList.add('touched');
            _this.controls.forward.classList.remove('touched');
            if (!_this.game.paused) {
              _this.map.clearAnimation('right');
              _this.map.clearAnimation('left');
              interval = setInterval(function() {
                var collision;
                collision = _this.map.collision.checkAll(_this.map.objs.character.domEl, null, _this.map.options.animation.shift, 0);
                if (!collision.status && !_this.map.animations.left.stopped) {
                  return _this.map.move(_this.map.options.animation.shift, 0);
                }
              }, _this.map.options.animation.duration);
              _this.map.animations.left.interval = interval;
              return _this.map.objs.character.move(true);
            }
          },
          on_keyup: function() {
            _this.controls.backward.classList.remove('touched');
            _this.map.clearAnimation('left');
            if (_this.map.animations.right.interval == null) {
              return _this.map.objs.character.stop('run');
            }
          },
          prevent_repeat: true,
          prevent_default: true
        }, {
          keys: 'up',
          on_keydown: function() {
            var interval, t;
            _this.controls.buttonB.classList.add('touched');
            if (!(_this.map.animations.up.interval != null) && !_this.map.animations.up.stopped) {
              t = 0;
              interval = setInterval(function() {
                var y;
                if (!_this.game.paused) {
                  y = Math.round(_this.map.objs.character.options.jump.force * _this.map.objs.character.options.jump.sinusAngle - _this.map.options.animation.gravity * t);
                  _this.map.move(0, y);
                  return t++;
                }
              }, _this.map.options.animation.duration);
              return _this.map.animations.up.interval = interval;
            }
          },
          on_keyup: function() {
            return _this.controls.buttonB.classList.remove('touched');
          },
          prevent_repeat: true,
          prevent_default: true
        }, {
          keys: 'space',
          on_keydown: function() {
            var bgWall, classList, doorCollision, fgWall, solidCollision, wallClass;
            _this.controls.buttonA.classList.add('touched');
            if (!_this.game.paused) {
              doorCollision = _this.map.collision.checkAll(_this.map.objs.character.domEl, _this.map.elements.door, 0, 0);
              if (doorCollision.status) {
                classList = doorCollision.element.getAttribute('class');
                wallClass = classList.match(/wall-\d+/g)[0];
                bgWall = document.querySelector("#background ." + wallClass);
                fgWall = document.querySelector("#foreground ." + wallClass);
                solidCollision = _this.map.collision.checkBetween(_this.map.objs.character.domEl, fgWall.querySelector('.solid'), 0, _this.map.options.doorsRadius);
                if (!doorCollision.element.classList.contains('pending') && !solidCollision) {
                  bgWall.classList.toggle('open');
                  bgWall.classList.add('pending');
                  fgWall.classList.toggle('open');
                  fgWall.classList.add('pending');
                  if (_this.game.audio.openingDoors.getVolume() > 0) {
                    return _this.game.audio.openingDoors.play();
                  }
                }
              }
            }
          },
          on_keyup: function() {
            return _this.controls.buttonA.classList.remove('touched');
          },
          prevent_repeat: true,
          prevent_default: true
        }, {
          keys: 'escape',
          on_keydown: function() {
            _this.controls.pause.classList.add('touched');
            if (_this.game.paused) {
              return _this.game.start();
            } else {
              return _this.pause();
            }
          },
          on_keyup: function() {
            return _this.controls.pause.classList.remove('touched');
          },
          prevent_repeat: true,
          prevent_default: true
        }, {
          keys: 'p',
          on_keydown: function() {
            _this.controls.pause.classList.add('touched');
            if (_this.game.paused) {
              return _this.game.start();
            } else {
              return _this.pause();
            }
          },
          on_keyup: function() {
            return _this.controls.pause.classList.remove('touched');
          },
          prevent_repeat: true,
          prevent_default: true
        }
      ];
      keypress.register_many(movements);
    };

    Control.prototype.showTouchItems = function() {
      var i, length;
      i = 0;
      length = this.touchItems.length;
      while (i < length) {
        this.touchItems[i].style.display = 'block';
        i++;
      }
    };

    Control.prototype.addControlEvents = function() {
      var controller, _i, _len, _ref,
        _this = this;
      _ref = this.controls;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        controller = _ref[_i];
        this.preventLongPressMenu(controller);
      }
      this.addEvent(this.controls.backward, 'touchstart', function() {
        document.body.onkeydown({
          keyCode: 37
        });
        return _this.controls.backward.classList.add('touched');
      });
      this.addEvent(this.controls.backward, 'touchend', function() {
        document.body.onkeyup({
          keyCode: 37
        });
        return _this.controls.backward.classList.remove('touched');
      });
      this.addEvent(this.controls.forward, 'touchstart', function() {
        document.body.onkeydown({
          keyCode: 39
        });
        return _this.controls.forward.classList.add('touched');
      });
      this.addEvent(this.controls.forward, 'touchend', function() {
        document.body.onkeyup({
          keyCode: 39
        });
        return _this.controls.forward.classList.remove('touched');
      });
      this.addEvent(this.controls.buttonB, 'touchstart', function() {
        document.body.onkeydown({
          keyCode: 38
        });
        return _this.controls.buttonB.classList.add('touched');
      });
      this.addEvent(this.controls.buttonB, 'touchend', function() {
        document.body.onkeyup({
          keyCode: 38
        });
        return _this.controls.buttonB.classList.remove('touched');
      });
      this.addEvent(this.controls.buttonA, 'touchstart', function() {
        document.body.onkeydown({
          keyCode: 32
        });
        return _this.controls.buttonA.classList.add('touched');
      });
      this.addEvent(this.controls.buttonA, 'touchend', function() {
        document.body.onkeyup({
          keyCode: 32
        });
        return _this.controls.buttonA.classList.remove('touched');
      });
      this.addEvent(this.controls.pause, 'touchstart', function() {
        document.body.onkeydown({
          keyCode: 27
        });
        return _this.controls.pause.classList.add('touched');
      });
      this.addEvent(this.controls.pause, 'touchend', function() {
        document.body.onkeyup({
          keyCode: 27
        });
        return _this.controls.pause.classList.remove('touched');
      });
    };

    Control.prototype.pause = function() {
      this.game.pause();
      this.fadeIn(this.game.elements.game.overlay);
      this.fadeIn(this.game.menu.element.main.element);
    };

    return Control;

  })(Base);

  (typeof exports !== "undefined" && exports !== null ? exports : this).Control = Control;

}).call(this);
