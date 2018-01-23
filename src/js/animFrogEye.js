var $ = require('jquery-slim');

require('gsap/CSSPlugin');
var TweenLite = require('gsap/TweenLite');

module.exports = function(eye, pupil){
    if (!eye.length) return;
    var horizontal = {
        size:  function($el) { return $el.width(); },
        position: function($el) { return $el.position().left; },
        offset:   function($el) { return $el.offset().left; },
        cursor:   function(event) { return event.pageX; },
    };
    var vertical = {
        size:  function($el) { return $el.height(); },
        position: function($el) { return $el.position().top; },
        offset:   function($el) { return $el.offset().top; },
        cursor:   function(event) { return event.pageY; },
    };

    function coordinate(pupil, eye, cursor, axis) {
        var eyeSize = axis.size(eye) - axis.size(pupil);
        var distance = axis.cursor(cursor) +
                    axis.position(pupil) -
                    axis.offset(pupil) -
                    axis.size(pupil) / 2;
        return Math.max(0, Math.min(eyeSize, distance));
    }

    $(document).on('mousemove', function(event) {
        TweenLite.set(pupil, {
            x: coordinate(pupil, eye, event, horizontal),
            y: coordinate(pupil, eye, event, vertical)
        });
    });
}