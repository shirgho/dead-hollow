// Generated by CoffeeScript 1.4.0

/*

Solid CoffeeScript class.

@author: Marcin Wieprzkowicz (marcin.wieprzkowicz@gmail.com)
*/


(function() {
  var Solid;

  Solid = (function() {

    function Solid(element) {
      this.element = element;
      this.position = this.getPosition(element);
      this.height = element.clientHeight;
      this.width = element.clientWidth;
    }

    Solid.prototype.getPosition = function(element) {
      var x, y;
      x = 0;
      y = 0;
      while (element.offsetParent) {
        x += element.offsetLeft;
        y += element.offsetTop;
        if (element.offsetParent.id === 'map') {
          break;
        }
        element = element.offsetParent;
      }
      return {
        x: x,
        y: y
      };
    };

    Solid.prototype.getHeightAgain = function() {
      return this.height = this.element.clientHeight;
    };

    return Solid;

  })();

  (typeof exports !== "undefined" && exports !== null ? exports : this).Solid = Solid;

}).call(this);