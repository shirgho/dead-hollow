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
      element: {
        map: '#map',
        foreground: '#foreground',
        background: '#background',
        doors: '.door',
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
      var door, doors, _i, _len, _ref;
      this.game = game;
      this.setDefaultPosition = __bind(this.setDefaultPosition, this);

      Map.__super__.constructor.apply(this, arguments);
      this.setDefaultPosition();
      this.objs = {};
      this.element = {
        map: document.querySelector(this.options.element.map),
        foreground: document.querySelector(this.options.element.foreground),
        background: document.querySelector(this.options.element.background),
        doors: document.querySelectorAll(this.options.element.doors),
        theEndTrigger: document.querySelector(this.options.element.theEndTrigger),
        infoTrigger: document.querySelector(this.options.element.infoTrigger)
      };
      this.element.map.style.display = 'block';
      this.collision = new Collision({}, this.position);
      doors = [];
      _ref = this.element.doors;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        door = _ref[_i];
        doors.push(new Solid(door));
      }
      this.solid = {
        doors: doors,
        theEndTrigger: new Solid(this.element.theEndTrigger),
        infoTrigger: new Solid(this.element.infoTrigger)
      };
      this.movingPlatform = new MovingPlatform;
      this.addEvents();
    }

    Map.prototype.setDefaultPosition = function() {
      if (this.position == null) {
        this.position = {};
      }
      this.position.x = this.options.position.x;
      this.position.y = this.options.position.y;
      return this;
    };

    Map.prototype.addEvents = function() {
      var i, length, transitionEnd;
      i = 0;
      length = this.element.doors.length;
      transitionEnd = this.globals.event.transitionEnd;
      while (i < length) {
        this.addEvent(this.element.doors[i], transitionEnd, function(event) {
          event.target.parentNode.classList.remove('pending');
        });
        i++;
      }
    };

    Map.prototype.add = function(element) {
      this.element.map.appendChild(element.domElement);
      this.objs[element.options.id] = element;
      element.solid = new Solid(element.domElement);
    };

    Map.prototype.draw = function() {
      var _this = this;
      return requestAnimationFrame(function() {
        _this.element.foreground.style[_this.globals.css.transform] = "translate3d(" + _this.position.x + "px, " + _this.position.y + "px, 0)";
        _this.element.background.style[_this.globals.css.transform] = "translate3d(" + _this.position.x + "px, " + _this.position.y + "px, 0)";
        _this.movingPlatform.draw();
      });
    };

    Map.prototype.move = function(x, y) {
      var lowerVerticalCollision;
      this.position.x += x;
      if (this.position.y + y >= this.options.position.y) {
        this.position.y += y;
      } else {
        this.position.y = this.options.position.y;
        lowerVerticalCollision = this.collision.checkAll(this.objs.character.solid, null, 0, -this.options.animation.shift);
        if (!lowerVerticalCollision.status) {
          this.game.gameOver(y);
        }
      }
    };

    Map.prototype.handleCollisions = function() {
      var horizontal, horizontalCollision, index, lessThanShift, lowerVerticalCollision, movingCol, upperVerticalCollision, vertical, y;
      horizontal = (this.globals.movement.backward - this.globals.movement.forward) * this.options.animation.shift;
      vertical = 0;
      if (horizontal !== 0) {
        horizontalCollision = this.collision.checkAll(this.objs.character.solid, null, horizontal, 0);
        this.objs.character.move(horizontal > 0);
        if (horizontalCollision.status) {
          horizontal = 0;
        }
      } else {
        this.objs.character.stop('run');
      }
      lowerVerticalCollision = this.collision.checkAll(this.objs.character.solid, null, 0, -this.options.animation.shift);
      if (lowerVerticalCollision.status) {
        lessThanShift = this.objs.character.solid.position.y + this.objs.character.solid.height - lowerVerticalCollision.solid.position.y - this.position.y;
        vertical += lessThanShift;
        if (this.objs.character.inAir) {
          this.objs.character.stop('jump');
        }
      } else {
        upperVerticalCollision = this.collision.checkAll(this.objs.character.solid, null, 0, this.options.animation.shift);
        if (upperVerticalCollision.status) {
          this.objs.character.appliedForce = 0;
        }
        this.objs.character.jump();
        y = -this.options.animation.gravity * this.objs.character.ticks;
        this.objs.character.ticks++;
        vertical += y;
      }
      vertical += this.objs.character.appliedForce;
      if (this.globals.movement.up && !this.objs.character.inAir) {
        this.objs.character.appliedForce = this.objs.character.options.jump.force;
      }
      this.move(horizontal, vertical);
      movingCol = this.collision.checkAll(this.objs.character.solid, this.movingPlatform.solid, 0, -this.options.animation.shift);
      if (movingCol.status) {
        index = this.getIndex(movingCol.solid.element);
        if (this.movingPlatform.platform[index].direction === 'normal') {
          this.move(-this.movingPlatform.options.animation.shift, 0);
        } else {
          this.move(this.movingPlatform.options.animation.shift, 0);
        }
      }
      if (this.collision.checkBetween(this.objs.character.solid, this.solid.theEndTrigger, 0, 0)) {
        this.game.theEnd();
      }
      if (this.collision.checkBetween(this.objs.character.solid, this.solid.infoTrigger, 0, 0)) {
        this.game.aboutMe();
      }
    };

    Map.prototype.closeDoors = function() {
      var door, _i, _len, _ref;
      _ref = this.element.doors;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        door = _ref[_i];
        door.classList.remove('open');
      }
      return this;
    };

    return Map;

  })(Base);

  (typeof exports !== "undefined" && exports !== null ? exports : this).Map = Map;

}).call(this);
