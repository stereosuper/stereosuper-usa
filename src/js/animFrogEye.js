var $ = require('jquery-slim');

require('gsap/CSSPlugin');
var TweenLite = require('gsap/TweenLite');

module.exports = function(eye, pupil, rectVisu){
    if (!eye.length || !pupil.length || !rectVisu.length) return;

    const horizontal = {
        size:  function($el) { return $el.width(); },
        position: function($el) { return $el.position().left; },
        offset:   function($el) { return $el.offset().left; },
        cursor:   function(event) { return event.pageX; },
    };
    const vertical = {
        size:  function($el) { return $el.height(); },
        position: function($el) { return $el.position().top; },
        offset:   function($el) { return $el.offset().top; },
        cursor:   function(event) { return event.pageY; },
    };
    let rectVisuSize, distanceFromEye;
    let eyeSize, distance;

    function coordinate(pupil, eye, cursor, axis) {
        eyeSize = axis.size(eye) - axis.size(pupil);
        distance = axis.cursor(cursor) +
                    axis.position(pupil) -
                    axis.offset(pupil) -
                    axis.size(pupil) / 2;
        return Math.max(0, Math.min(eyeSize, distance));
    }

    function mapRange(value, low1, high1, low2, high2) {
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
    }

    function calculateDistance(elem, event) {
        rectVisuSize = rectVisu.outerWidth();
        distanceFromEye = Math.floor(Math.sqrt(Math.pow(event.pageX - (elem.offset().left+(elem.width()/2)), 2) + Math.pow(event.pageY - (elem.offset().top+(elem.height()/2)), 2)));
        return mapRange(distanceFromEye, 0, rectVisuSize, 1.8, 1);
    }

    rectVisu.on('mousemove', function(event) {
        TweenLite.set(pupil, {
            x: coordinate(pupil, eye, event, horizontal),
            y: coordinate(pupil, eye, event, vertical),
            scaleX: calculateDistance(eye, event)
        });
    });
}