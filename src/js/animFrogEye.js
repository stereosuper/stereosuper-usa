var $ = require('jquery-slim');

require('gsap/CSSPlugin');
require('gsap/EasePack');
var TweenLite = require('gsap/TweenLite');
var TimelineMax = require('gsap/TimelineMax');

module.exports = function(eye, pupil, throat, rectVisu, fly){
    if (!eye.length || !pupil.length || !throat.length || !rectVisu.length || !fly.length) return;

    const contentRect = rectVisu.find('.content-rect');
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
    let oldX = 0, oldY = 0, newX, newY, flyX, flyY, angleDeg, oldAngleDeg;
    const flyWidth = fly.width()/2, flyHeight = fly.height()/2;
    let count = 0, animgorge;

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

    function calculateDistance(elem, event){
        rectVisuSize = rectVisu.outerWidth();
        distanceFromEye = Math.floor(Math.sqrt(Math.pow(event.pageX - (elem.offset().left+(elem.width()/2)), 2) + Math.pow(event.pageY - (elem.offset().top+(elem.height()/2)), 2)));
        return mapRange(distanceFromEye, 0, rectVisuSize, 1.8, 1);
    }
    function moveFly(event){
        flyX = Math.round(event.pageX - rectVisu.offset().left - flyWidth);
        flyY = Math.round(event.pageY - rectVisu.offset().top - flyHeight);

        newX = flyX - Math.round(rectVisu.width()/2);
        newY = flyY - Math.round(rectVisu.height()/2);
        
        // calcul
        if(newX === oldX && newY === oldY ){
            angleDeg = oldAngleDeg;
        }else{
            angleDeg = Math.atan2(newY - oldY, newX - oldX) * 180 / Math.PI;
        }

        oldX = newX;
        oldY = newY;
        oldAngleDeg = angleDeg;
        TweenLite.set(fly, {
            x: flyX,
            y: flyY,
            rotation: angleDeg
        });
    }

    function animThroat(){
        animgorge = new TimelineMax({repeat: -1, yoyo:true, repeatDelay: 0.5});
        animgorge.to(throat, 0.5, {scale: 2, x: '-35%', ease: Power2.easeOut});
    }

    animThroat();
    rectVisu.on('mousemove', function(event){
        TweenLite.set(pupil, {
            x: coordinate(pupil, eye, event, horizontal),
            y: coordinate(pupil, eye, event, vertical),
            scaleX: calculateDistance(eye, event)
        });
        moveFly(event);
    }).on('mouseenter', function(event){
        TweenLite.fromTo(contentRect, 0.8, {scale: 0.9}, {scale: 1, ease: Elastic.easeOut});
        TweenLite.set(fly, {opacity: 1});
    }).on('mouseleave', function(event){
        TweenLite.fromTo(contentRect, 0.8, {scale: 0.95}, {scale: 1, ease: Elastic.easeOut});
        TweenLite.to(pupil, 0.1, {
            x: '70%',
            y: 0,
            scaleX: 1
        });
        TweenLite.set(fly, {opacity: 0});
    });
}