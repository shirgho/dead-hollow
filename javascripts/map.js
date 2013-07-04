// Generated by CoffeeScript 1.4.0

/*

Map CoffeeScript class.
Moves/draws a map, handles collisions and also contains animations object.

@author: Marcin Wieprzkowicz (marcin.wieprzkowicz@gmail.com)
*/


(function() {
  var Map,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Map = (function(_super) {

    __extends(Map, _super);

    Map.prototype.defaults = {
      position: {
        x: -2500,
        y: 50
      },
      elements: {
        map: '#map',
        foreground: '#foreground',
        background: '#background',
        door: '.door',
        theEndTrigger: '#the-end-trigger',
        infoTrigger: '#info div'
      },
      animation: {
        shift: 10,
        gravity: 2,
        duration: 50
      },
      doorsRadius: 70
    };

    function Map(options, game) {
      this.game = game;
      this.setDefaultPosition = __bind(this.setDefaultPosition, this);

      Map.__super__.constructor.apply(this, arguments);
      this.setDefaultPosition();
      this.animations = {
        right: {
          interval: void 0,
          stopped: true
        },
        left: {
          interval: void 0,
          stopped: true
        },
        up: {
          interval: void 0,
          stopped: true
        }
      };
      this.objs = {};
      this.elements = {
        map: document.querySelector(this.options.elements.map),
        foreground: document.querySelector(this.options.elements.foreground),
        background: document.querySelector(this.options.elements.background),
        door: document.querySelectorAll(this.options.elements.door),
        theEndTrigger: document.querySelector(this.options.elements.theEndTrigger),
        infoTrigger: document.querySelector(this.options.elements.infoTrigger)
      };
      this.elements.map.style.display = 'block';
      this.collision = new Collision({}, this.position);
      this.collision.calcPositions(this.elements.door);
      this.collision.calcPositions(this.elements.theEndTrigger);
      this.collision.calcPositions(this.elements.infoTrigger);
      this.movingPlatform = new MovingPlatform();
      this.addEvents();
    }

    Map.prototype.setDefaultPosition = function() {
      if (this.position == null) {
        this.position = {};
      }
      this.position.x = this.options.position.x;
      this.position.y = this.options.position.y;
    };

    Map.prototype.addEvents = function() {
      var i, length, transitionEnd;
      i = 0;
      length = this.elements.door.length;
      transitionEnd = this.getTransitionEndName();
      while (i < length) {
        this.addEvent(this.elements.door[i], transitionEnd, function(event) {
          event.target.parentNode.classList.remove('pending');
        });
        i++;
      }
    };

    Map.prototype.animationsStopped = function(stopped) {
      this.animations.right.stopped = stopped;
      this.animations.left.stopped = stopped;
      this.animations.up.stopped = stopped;
    };

    Map.prototype.add = function(element) {
      this.elements.map.appendChild(element.domEl);
      this.objs[element.options.id] = element;
      this.collision.calcPositions(element.domEl);
    };

    Map.prototype.draw = function() {
      var _this = this;
      requestAnimationFrame(function() {
        _this.elements.foreground.style[_this.cssTransform] = "translate3d(" + _this.position.x + "px, " + _this.position.y + "px, 0)";
        _this.elements.background.style[_this.cssTransform] = "translate3d(" + _this.position.x + "px, " + _this.position.y + "px, 0)";
        _this.movingPlatform.draw();
        return _this.handleCollisions();
      });
    };

    Map.prototype.move = function(x, y) {
      var lowerCollision;
      this.position.x += x;
      if (this.position.y + y >= this.options.position.y) {
        this.position.y += y;
      } else {
        this.position.y = this.options.position.y;
        lowerCollision = this.collision.checkAll(this.objs.character.domEl, null, 0, -this.options.animation.shift);
        if (!lowerCollision.status) {
          this.game.gameOver(y);
        }
      }
    };

    Map.prototype.clearAnimation = function(animation) {
      var interval;
      if (animation in this.animations) {
        interval = this.animations[animation].interval;
        if (interval != null) {
          clearInterval(interval);
          this.animations[animation] = {
            interval: void 0,
            stopped: this.game.paused
          };
        }
      }
    };

    Map.prototype.handleCollisions = function() {
      var callback, index, lessThanShift, lowerCollision, movingCol, upperCollision, y,
        _this = this;
      lowerCollision = this.collision.checkAll(this.objs.character.domEl, null, 0, -this.options.animation.shift);
      if (lowerCollision.status) {
        lessThanShift = this.objs.character.domEl.position.y + this.objs.character.domEl.clientHeight - lowerCollision.element.position.y - this.position.y;
        this.move(0, lessThanShift);
        if (this.objs.character.inAir) {
          this.clearAnimation('up');
          callback = function() {
            _this.animations.up.stopped = false;
            if (_this.animations.right.interval != null) {
              _this.objs.character.move();
            }
            if (_this.animations.left.interval != null) {
              return _this.objs.character.move(true);
            }
          };
          this.objs.character.stop('jump', callback);
        }
      } else {
        upperCollision = this.collision.checkAll(this.objs.character.domEl, null, 0, this.options.animation.shift);
        if (upperCollision.status) {
          this.clearAnimation('up');
          this.animations.up.stopped = true;
          this.move(0, -this.options.animation.shift);
        } else if (!this.objs.character.inAir) {
          this.animations.up.stopped = true;
          this.objs.character.stop('run');
          this.objs.character.jump();
        } else if (!(this.animations.up.interval != null)) {
          y = this.options.animation.gravity * this.objs.character.inAir;
          this.move(0, -y);
          this.objs.character.inAir++;
        }
      }
      movingCol = this.collision.checkAll(this.objs.character.domEl, this.movingPlatform.elements.solid, 0, -this.options.animation.shift);
      if (movingCol.status) {
        index = this.getIndex(movingCol.element.parentNode);
        if (this.movingPlatform.platform[index].direction === 'normal') {
          this.move(-this.movingPlatform.options.animation.shift, 0);
        } else {
          this.move(this.movingPlatform.options.animation.shift, 0);
        }
      }
      if (this.collision.checkBetween(this.objs.character.domEl, this.elements.theEndTrigger, 0, 0)) {
        this.game.theEnd();
      }
      if (this.collision.checkBetween(this.objs.character.domEl, this.elements.infoTrigger, 0, 0)) {
        this.game.aboutMe();
      }
    };

    Map.prototype.closeDoors = function() {
      var door, _i, _len, _ref;
      _ref = this.elements.door;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        door = _ref[_i];
        door.classList.remove('open');
      }
    };

    return Map;

  })(Base);

  (typeof exports !== "undefined" && exports !== null ? exports : this).Map = Map;

}).call(this);
