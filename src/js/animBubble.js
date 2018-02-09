
var $ = require('jquery-slim');

var throttle = require('./throttle.js');
window.requestAnimFrame = require('./requestAnimFrame.js');

require('gsap');
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
        TweenMax.set(elemToRound, {clearProps: 'width, height', onCompleteScope: elemToRound, onComplete: function(){
            const elemBounding = this[0].getBoundingClientRect();
            TweenMax.set(this, {width: 2*Math.round(elemBounding.width/2), height: 2*Math.round(elemBounding.height/2)});
        }});
    }
    function updateResize(){
        roundElem(sprite);
    }

    animateSprites();
    roundElem(sprite);

    var resizeHandler = throttle(function(){
        requestAnimFrame(updateResize);
    }, 40);

    $(window).on('resize', resizeHandler);
}