// Generated by CoffeeScript 1.4.0

/*

Base CoffeeScript class based on: https://gist.github.com/rpflorence/3681784.
The most important functionality is 'setOptions' - brings back good memories of MooTools :).
It also contains many useful functions.

@author: Marcin Wieprzkowicz (marcin.wieprzkowicz@gmail.com)
*/


(function() {
  var Base, transitionEnd,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty;

  transitionEnd = function() {
    var transitionEndEventNames;
    transitionEndEventNames = {
      'WebkitTransition': 'webkitTransitionEnd',
      'MozTransition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'msTransition': 'MSTransitionEnd',
      'transition': 'transitionend'
    };
    return transitionEndEventNames[Modernizr.prefixed('transition')];
  };

  Base = (function() {

    Base.prototype.defaults = {};

    function Base(options) {
      this.setOptions(options);
      this.globals = this.initGlobals();
    }

    Base.prototype.setOptions = function(options) {
      this.options = this.merge({}, this.defaults, options);
      return this;
    };

    Base.prototype.initGlobals = function() {
      return window.deadHollow = window.deadHollow || {
        pause: false,
        solids: [],
        movement: {
          forward: 0,
          backward: 0,
          up: 0
        },
        css: {
          transform: Modernizr.prefixed('transform')
        },
        event: {
          transitionEnd: transitionEnd()
        }
      };
    };

    Base.prototype.addEvent = function(element, event, callback, useCapture) {
      if (useCapture == null) {
        useCapture = false;
      }
      element.addEventListener(event, callback, useCapture);
      return element;
    };

    Base.prototype.stop = function() {
      if (event && event.preventDefault) {
        event.preventDefault();
      }
      return event;
    };

    Base.prototype.fadeIn = function(elements, complete) {
      var callback, element, fade, _i, _len;
      if (!(elements instanceof Array)) {
        elements = [elements];
      }
      fade = function(element) {
        element.classList.remove('hide');
        element.classList.add('show');
        element.style.opacity = 1;
        element.style.visibility = 'visible';
        return element;
      };
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        element = elements[_i];
        fade(element);
      }
      if (complete) {
        transitionEnd = this.globals.event.transitionEnd;
        this.addEvent(elements[0], transitionEnd, callback = function() {
          elements[0].removeEventListener(transitionEnd, callback, false);
          return complete.call(this);
        });
      }
    };

    Base.prototype.fadeOut = function(elements, complete) {
      var callback, element, fade, _i, _len;
      if (!(elements instanceof Array)) {
        elements = [elements];
      }
      fade = function(element) {
        element.classList.remove('show');
        element.classList.add('hide');
        element.style.opacity = 0;
        element.style.visibility = 'hidden';
        return element;
      };
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        element = elements[_i];
        fade(element);
      }
      if (complete) {
        transitionEnd = this.globals.event.transitionEnd;
        this.addEvent(elements[0], transitionEnd, callback = function() {
          elements[0].removeEventListener(transitionEnd, callback, false);
          return complete.call(this);
        });
      }
    };

    Base.prototype.getIndex = function(element) {
      return parseInt(element.className.match(/\w*-(\d+)/)[1], 10);
    };

    Base.prototype.setText = function(element, text) {
      if (element.innerText) {
        element.innerText = text;
      } else {
        element.textContent = text;
      }
      return element;
    };

    Base.prototype.flexcrollContent = function(element) {
      fleXenv.fleXcrollMain(element.querySelector('.flexcroll'));
      return element;
    };

    Base.prototype.merge = function() {
      var extension, extensions, property, target, _i, _len;
      target = arguments[0], extensions = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      for (_i = 0, _len = extensions.length; _i < _len; _i++) {
        extension = extensions[_i];
        for (property in extension) {
          if (!__hasProp.call(extension, property)) continue;
          target[property] = extension[property];
        }
      }
      return target;
    };

    return Base;

  })();

  (typeof exports !== "undefined" && exports !== null ? exports : this).Base = Base;

}).call(this);
