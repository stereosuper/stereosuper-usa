'use strict';

var $ = require('jquery-slim');
var isMobile = require('ismobilejs');

// require('gsap');
require('gsap/CSSPlugin');
var TweenLite = require('gsap/TweenLite');


$(function(){

    window.requestAnimFrame = require('./requestAnimFrame.js');
    const throttle = require('./throttle.js');
    const noTransition = require('./noTransition.js');
    const animFrogEye = require('./animFrogEye.js');
    const animBubble = require('./animBubble.js');
    const recipe = require('./recipe.js');
    const gyro = require('./gyro.js');
    const animRefs = require('./animRefs.js');

    var body = $('body');
    // window.outerWidth returns the window width including the scroll, but it's not working with $(window).outerWidth
    var windowWidth = window.outerWidth, windowHeight = $(window).height();
    const frog = $('#frog'), frogEye = $('#frogEye'), frogPupil = $('#frogPupil'), frogThroat = $('#frogThroat'), rectVisu = $('#rectVisu'), contentRectVisu = $('#contentRectVisu'), fly = $('#fly'), triggerFly = $('#triggerFly');
    const bubble1 = $('#bubble1');
    const bubble2 = $('#bubble2');
    const bubble3 = $('#bubble3');


    function resizeHandler(){
        windowWidth = window.outerWidth;
        windowHeight = $(window).height();
    }

    function loadHandler(){

    }

    animFrogEye(frog, frogEye, frogPupil, frogThroat, rectVisu, contentRectVisu, fly, triggerFly);
    animBubble(bubble1, 5.4);
    animBubble(bubble2, 6.1);
    animBubble(bubble3, 9.3);
    recipe(isMobile.any);
    animRefs($('.reference'));
    gyro($('#baseline, #contact'));

    $('#contactLink').on('mouseenter', function(event){
        TweenLite.to($('#contactRect'), 0.6, {scale: 0.95, ease: Elastic.easeOut.config(1, 0.2)});
    }).on('mouseleave', function(event){
        TweenLite.to($('#contactRect'), 0.1, {scale: 1, ease: Power1.easeInOut});
    });


    isMobile.any ? body.addClass('is-mobile') : body.addClass('is-desktop');

    // Since script is loaded asynchronously, load event isn't always fired !!!
    document.readyState === 'complete' ? loadHandler() : $(window).on('load', loadHandler);

    $(window).on('resize', throttle(function(){
        requestAnimFrame(resizeHandler);
    }, 60));

    $(document).on('scroll', throttle(function(){

    }, 60));

});
