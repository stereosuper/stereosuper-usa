var $ = require('jquery-slim');

var throttle = require('./throttle.js');
window.requestAnimFrame = require('./requestAnimFrame.js');

require('gsap/CSSPlugin');
require('gsap/EasePack');
var TweenLite = require('gsap/TweenLite');
var TimelineMax = require('gsap/TimelineMax');
const mapRange = require('./mapRange');

module.exports = function(frog, eye, pupil, throat, rectVisu, contentRectVisu, fly, triggerFly){
    if (!frog.length || !eye.length || !pupil.length || !throat.length || !rectVisu.length || !fly.length || !triggerFly.length) return;

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
    let tlFrog, cols, rows, gridWidth, gridHeight, interval;
    let flyActive = true;

    function coordinate(pupil, eye, cursor, axis) {
        eyeSize = axis.size(eye) - axis.size(pupil);
        distance = axis.cursor(cursor) +
                    axis.position(pupil) -
                    axis.offset(pupil) -
                    axis.size(pupil) / 2;
        return Math.max(0, Math.min(eyeSize, distance));
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

    function reinitFrog(){
        tlFrog.pause(0);
    }

    function animateSprites(){
        cols = 4;
        rows = 4;
        gridWidth = 33.333333;
        gridHeight = 33.333333;
        //var interval = 0.5; //for testing
        interval = 0.03;



        tlFrog = new TimelineLite({paused: true, onComplete: reinitFrog});
        var count = 0;
        for (var r = 0; r < rows; r++){
            for (var c = 0; c < cols; c++){ 
                var xpos = c * gridWidth;
                var ypos = r * gridHeight;
                tlFrog.set(frog, {backgroundPosition: xpos + '% ' +  ypos + '%'}, count * interval);
                count++;
            }
        }

        triggerFly.on('mouseenter', function(event){
            if(flyActive){
                tlFrog.play();
                TweenLite.set(fly, {opacity: 0});
                flyActive = false;
                animgorge.restart();
                TweenLite.delayedCall(0.2, function(){
                    rectVisu.removeClass('no-cursor');
                });
            }
        });
    }

    function roundElem(elemToRound){
        TweenLite.set(elemToRound, {clearProps: 'width, height'});
        TweenLite.set(elemToRound, {width: 2*Math.round(elemToRound.width()/2), height: 2*Math.round(elemToRound.height()/2)});
    }

    function updateResize(){
        roundElem(frog);
    }

    animateSprites();
    animThroat();
    roundElem(frog);
    
    rectVisu.on('mousemove', function(event){
        TweenLite.set(pupil, {
            x: coordinate(pupil, eye, event, horizontal),
            y: coordinate(pupil, eye, event, vertical),
            scaleX: calculateDistance(eye, event)
        });
        moveFly(event);
    }).on('mouseenter', function(event){
        TweenLite.to(contentRectVisu, 0.6, {scale: 0.97, ease: Elastic.easeOut.config(1, 0.2)});
        TweenLite.set(fly, {opacity: 1});
        $(this).addClass('no-cursor');
    }).on('mouseleave', function(event){
        TweenLite.to(contentRectVisu, 0.1, {scale: 1, ease: Power1.easeInOut});
        TweenLite.to(pupil, 0.1, {
            x: '70%',
            y: 0,
            scaleX: 1
        });
        TweenLite.set(fly, {opacity: 0});
        flyActive = true;
        $(this).removeClass('no-cursor');
    });

    var resizeHandler = throttle(function(){
        requestAnimFrame(updateResize);
    }, 40);

    $(window).on('resize', resizeHandler);
}