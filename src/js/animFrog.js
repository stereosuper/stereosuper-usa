const $ = require('jquery-slim');

const throttle = require('./throttle.js');
window.requestAnimFrame = require('./requestAnimFrame.js');

require('gsap');
const mapRange = require('./mapRange');

module.exports = function(visuFrog){
    if (!visuFrog.length) return;
    const frog = $('#frog'), eye = $('#frogEye'), pupil = $('#frogPupil'), throat = $('#frogThroat'), rectVisu = $('#rectVisu'), contentRectVisu = $('#contentRectVisu'), fly = $('#fly'), triggerFly = $('#triggerFly');

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
        const elemBounding = elem[0].getBoundingClientRect(), elemOffset = elem.offset();
        rectVisuSize = rectVisu.outerWidth();
        distanceFromEye = (Math.hypot(event.pageX - (elemOffset.left+(elemBounding.width/2)), event.pageY - (elemOffset.top+(elemBounding.height/2)))) | 0;
        return mapRange(distanceFromEye, 0, rectVisuSize, 1.8, 1);
    }
    function moveFly(event){
        const rectVisuBounding = rectVisu[0].getBoundingClientRect(), rectVisuOffset = rectVisu.offset();
        
        // | 0 = Math.floor()
        flyX = (event.pageX - rectVisuOffset.left - flyWidth) | 0;
        flyY = (event.pageY - rectVisuOffset.top - flyHeight) | 0;

        newX = flyX - (rectVisuBounding.width/2) | 0;
        newY = flyY - (rectVisuBounding.height/2) | 0;

        // calcul
        angleDeg = (newX === oldX && newY === oldY) ? oldAngleDeg : Math.atan2(newY - oldY, newX - oldX) * 180 / Math.PI;

        oldX = newX;
        oldY = newY;
        oldAngleDeg = angleDeg;
        TweenMax.set(fly, {
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
        // interval = 0.5; //for testing
        interval = 0.03;

        tlFrog = new TimelineMax({paused: true, onComplete: reinitFrog});
        let count = 0, xpos, ypos;
        for (let r = 0; r < rows; r++){
            for (let c = 0; c < cols; c++){ 
                xpos = c * gridWidth;
                ypos = r * gridHeight;
                tlFrog.set(frog, {backgroundPosition: xpos + '% ' +  ypos + '%'}, count * interval);
                count++;
            }
        }

        triggerFly.on('mouseenter', function(event){
            if(flyActive){
                tlFrog.play();
                TweenMax.set(fly, {opacity: 0});
                flyActive = false;
                animgorge.restart();
                TweenMax.delayedCall(0.2, function(){
                    rectVisu.removeClass('no-cursor');
                });
            }
        });
    }

    function roundElem(elemToRound){
        TweenMax.set(elemToRound, {clearProps: 'width, height', onCompleteScope: elemToRound, onComplete: function(){
            const elemBounding = this[0].getBoundingClientRect();
            TweenMax.set(this, {width: 2*Math.round(elemBounding.width/2), height: 2*Math.round(elemBounding.height/2)});
        }});
    }

    function updateResize(){
        roundElem(frog);
    }

    animateSprites();
    animThroat();
    roundElem(frog);
    
    rectVisu.on('mousemove', function(event){
        TweenMax.set(pupil, {
            x: coordinate(pupil, eye, event, horizontal),
            y: coordinate(pupil, eye, event, vertical),
            scaleX: calculateDistance(eye, event)
        });
        moveFly(event);
    }).on('mouseenter', function(){
        TweenMax.to(contentRectVisu, 0.6, {scale: 0.97, ease: Elastic.easeOut.config(1, 0.2)});
        TweenMax.set(fly, {opacity: 1});
        $(this).addClass('no-cursor');
    }).on('mouseleave', function(){
        TweenMax.to(contentRectVisu, 0.1, {scale: 1, ease: Power1.easeInOut});
        TweenMax.to(pupil, 0.1, {
            x: '70%',
            y: 0,
            scaleX: 1
        });
        TweenMax.set(fly, {opacity: 0});
        flyActive = true;
        $(this).removeClass('no-cursor');
    });

    var resizeHandler = throttle(function(){
        requestAnimFrame(updateResize);
    }, 40);

    $(window).on('resize', resizeHandler);
}