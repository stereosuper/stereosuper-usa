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
    const recipe = require('./recipe.js');
    const gyro = require('./gyro.js');
    const animRefs = require('./animRefs.js');

    var body = $('body');
    // window.outerWidth returns the window width including the scroll, but it's not working with $(window).outerWidth
    var windowWidth = window.outerWidth, windowHeight = $(window).height();
    const frog = $('#frog'), frogEye = $('#frogEye'), frogPupil = $('#frogPupil'), frogThroat = $('#frogThroat'), rectVisu = $('#rectVisu'), contentRectVisu = $('#contentRectVisu'), fly = $('#fly'), triggerFly = $('#triggerFly');


    function resizeHandler(){
        windowWidth = window.outerWidth;
        windowHeight = $(window).height();
    }

    function loadHandler(){

    }

    animFrogEye(frog, frogEye, frogPupil, frogThroat, rectVisu, contentRectVisu, fly, triggerFly);
    recipe(isMobile.any);
    animRefs($('.reference'));
    gyro($('#baseline'));

    isMobile.any ? body.addClass('is-mobile') : body.addClass('is-desktop');

    // Since script is loaded asynchronously, load event isn't always fired !!!
    document.readyState === 'complete' ? loadHandler() : $(window).on('load', loadHandler);

    $(window).on('resize', throttle(function(){
        requestAnimFrame(resizeHandler);
    }, 60));

    $(document).on('scroll', throttle(function(){

    }, 60));

});
