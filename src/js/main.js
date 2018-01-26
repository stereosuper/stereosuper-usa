'use strict';

var $ = require('jquery-slim');

// require('gsap');
require('gsap/CSSPlugin');
var TweenLite = require('gsap/TweenLite');


$(function(){

    window.requestAnimFrame = require('./requestAnimFrame.js');
    var throttle = require('./throttle.js');
    var noTransition = require('./noTransition.js');
    var animFrogEye = require('./animFrogEye.js');
    const recipe = require('./recipe.js');

    var body = $('body');
    // window.outerWidth returns the window width including the scroll, but it's not working with $(window).outerWidth
    var windowWidth = window.outerWidth, windowHeight = $(window).height();
    const frogEye = $('#frogEye'), frogPupil = $('#frogPupil'), frogThroat = $('#frogThroat'), rectVisu = $('#rectVisu'), fly = $('#fly');


    function resizeHandler(){
        windowWidth = window.outerWidth;
        windowHeight = $(window).height();
    }

    function loadHandler(){

    }

    animFrogEye(frogEye, frogPupil, frogThroat, rectVisu, fly);
    recipe();

    // isMobile.any ? body.addClass('is-mobile') : body.addClass('is-desktop');

    // Since script is loaded asynchronously, load event isn't always fired !!!
    document.readyState === 'complete' ? loadHandler() : $(window).on('load', loadHandler);

    $(window).on('resize', throttle(function(){
        requestAnimFrame(resizeHandler);
    }, 60));

    $(document).on('scroll', throttle(function(){

    }, 60));

});
