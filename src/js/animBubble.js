
var $ = require('jquery-slim');

var throttle = require('./throttle.js');
window.requestAnimFrame = require('./requestAnimFrame.js');

require('gsap/CSSPlugin');
require('gsap/EasePack');
var TweenLite = require('gsap/TweenLite');
var TimelineMax = require('gsap/TimelineMax');
const mapRange = require('./mapRange');

module.exports = function(sprite, delay){
    let tlSprite, cols, rows, gridWidth, gridHeight, interval;

    function animateSprites(){
        cols = 4;
        rows = 5;
        gridWidth = 33.333333;
        gridHeight = 25;
        interval = 0.03;
        tlSprite = new TimelineMax({paused: true, repeat: -1, repeatDelay: delay, delay: delay});
        var count = 0;

        for (var r = 0; r < rows; r++){
            for (var c = 0; c < cols; c++){ 
                var xpos = c * gridWidth;
                var ypos = r * gridHeight;
                tlSprite.set(sprite, {backgroundPosition: xpos + '% ' +  ypos + '%'}, count * interval);
                count++;
            }
        }

        tlSprite.play();
    }

    function roundElem(elemToRound){
        TweenLite.set(elemToRound, {clearProps: 'width, height'});
        TweenLite.set(elemToRound, {width: 2*Math.round(elemToRound.width()/2), height: 2*Math.round(elemToRound.height()/2)});
    }
    function updateResize(){
        roundElem(frog);
    }

    animateSprites();
    roundElem(sprite);

    var resizeHandler = throttle(function(){
        requestAnimFrame(updateResize);
    }, 40);

    $(window).on('resize', resizeHandler);
}