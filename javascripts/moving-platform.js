// Generated by CoffeeScript 1.4.0

/*

Moving Platform CoffeeScript class.
Creates special type of platforms - moving platforms (Wow! I know, impressive, isn't it? ;)). 

@author: Marcin Wieprzkowicz (marcin.wieprzkowicz@gmail.com)
*/


(function() {
  var MovingPlatform,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  MovingPlatform = (function(_super) {

    __extends(MovingPlatform, _super);

    MovingPlatform.prototype.defaults = {
      movingPlatform: '.platform.moving',
      solid: '.platform.moving .solid',
      offset: 0,
      range: 489,
      animation: {
        shift: 5
      }
    };

    function MovingPlatform(options) {
      MovingPlatform.__super__.constructor.apply(this, arguments);
      this.elements = {
        movingPlatform: document.querySelectorAll(this.options.movingPlatform),
        solid: document.querySelectorAll(this.options.solid)
      };
    }

    MovingPlatform.prototype.initPlatforms = function() {
      var platform, _i, _len, _ref;
      _ref = this.elements.movingPlatform;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        platform = _ref[_i];
        this.setOffset(platform);
      }
    };

    MovingPlatform.prototype.setOffset = function(platform) {
      var child, offset, range;
      offset = platform.getAttribute('data-offset');
      offset = offset != null ? parseInt(offset, 10) : this.options.offset;
      range = platform.getAttribute('data-range');
      range = range != null ? parseInt(range, 10) : this.options.range;
      platform.movements = {
        offset: offset,
        range: range,
        direction: 'normal'
      };
      child = platform.firstElementChild;
      if (child != null) {
        child.position.x += offset;
      }
    };

    MovingPlatform.prototype.draw = function() {
      var platform, _i, _len, _ref;
      _ref = this.elements.movingPlatform;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        platform = _ref[_i];
        this.move(platform);
      }
    };

    MovingPlatform.prototype.move = function(platform) {
      var child;
      child = platform.firstElementChild;
      if (platform.movements.direction === 'normal') {
        platform.movements.offset += this.options.animation.shift;
        if (child != null) {
          child.position.x += this.options.animation.shift;
        }
      } else {
        platform.movements.offset -= this.options.animation.shift;
        if (child != null) {
          child.position.x -= this.options.animation.shift;
        }
      }
      if (platform.movements.offset === 0) {
        platform.movements.direction = 'normal';
      } else if (platform.movements.offset + platform.clientWidth >= platform.movements.range) {
        platform.movements.direction = 'alternate';
      }
      platform.style[this.cssTransform] = "translate3d(" + platform.movements.offset + "px, 0, 0)";
    };

    return MovingPlatform;

  })(Base);

  (typeof exports !== "undefined" && exports !== null ? exports : this).MovingPlatform = MovingPlatform;

}).call(this);
