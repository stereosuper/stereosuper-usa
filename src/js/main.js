import { Power4, TimelineMax } from 'gsap';

'use strict';

const $ = require('jquery-slim');
const isMobile = require('ismobilejs');

require('gsap');
require('gsap/scrollToPlugin');

global.jQuery = $;

const imagesLoaded = require('imagesloaded');
// provide jQuery argument
imagesLoaded.makeJQueryPlugin( $ );

$(function(){

    window.requestAnimFrame = require('./requestAnimFrame.js');
    const throttle = require('./throttle.js');
    const animFrog = require('./animFrog.js');
    const etVoilaMobile = require('./etVoilaMobile.js');
    const frogJump = require('./frogJump.js');
    const animBubble = require('./animBubble.js');
    const recipe = require('./recipe.js');
    const gyro = require('./gyro.js');
    const animRefs = require('./animRefs.js');

    var body = $('body');
    // window.outerWidth returns the window width including the scroll, but it's not working with $(window).outerWidth
    var windowWidth = window.outerWidth, windowHeight = $(window).height();
    const visuFrog = $('#visuFrog');
    const bubble1 = $('#bubble1');
    const bubble2 = $('#bubble2');
    const bubble3 = $('#bubble3');
    const baseline = $('#baseline');
    const frogLink = $('#frogLink');
    const condensed = frogLink.find('#iconFrog');
    const extended = frogLink.find('#iconFrog2');

    const allLoaded = () => {
        const loading = new TimelineMax();
        loading.to($('#firstO'), 1, {ease: Power4.easeInOut, scale: 1})
        .set(visuFrog, {opacity: 1})
        .to($('#secondO'), 1, {ease: Power4.easeInOut, scaleY: 0, transformOrigin:'center bottom'})
        .to($('#baselineTxt'), 1, {ease: Power4.easeInOut, opacity: 1, y:0, delay: -1})
        .to($('#headerLeft'), 1, {ease: Power4.easeInOut, opacity: 1, y:0, delay: -0.5})
        .to($('#headerRight'), 1, {ease: Power4.easeInOut, opacity: 1, y:0, delay: -0.6})
        .to($('#lateralLeft'), 1, {ease: Power4.easeInOut, opacity: 1, x:0, delay: -1})
        .to($('#lateralRight'), 1, {ease: Power4.easeInOut, opacity: 1, x:0, delay: -1})
        .set(body, {className: '+=on'})
        .set($('#firstO, #secondO'), {css:{ display: 'none'}})
        .set($('#load'), {css:{ display: 'none'}})        
        .to($('#recipe'), 1, {ease: Power4.easeInOut, opacity: 1, delay: -0.4, onComplete: readyHandler});
    };

    TweenMax.delayedCall(2, function(){
        if(baseline.length){
            baseline.imagesLoaded( function() {
                allLoaded();
            });
        }
    });


    function resizeHandler(){
        windowWidth = window.outerWidth;
        windowHeight = $(window).height();
    }

    function loadHandler(){
        
    }

    function readyHandler(){
        frogJump(condensed, extended);
        animFrog(visuFrog, isMobile.any);
        etVoilaMobile($('#voila'));
        animBubble(bubble1, 5.4);
        animBubble(bubble2, 6.1);
        animBubble(bubble3, 9.3);
        animRefs($('.reference'));
        gyro($('#baseline, #contact'), isMobile.any);
    }

    recipe(isMobile.any);
    

    $('#contactLink').on('mouseenter', function(){
        TweenMax.to($('#contactRect'), 0.6, {scale: 0.95, ease: Elastic.easeOut.config(1, 0.2)});
    }).on('mouseleave', function(){
        TweenMax.to($('#contactRect'), 0.1, {scale: 1, ease: Power1.easeInOut});
    });


    $('#toRecipe').on('click', function(e){
        e.preventDefault();
        TweenMax.to(window, 0.3, {scrollTo: '#recipe', offsetY:50});
    });
    $('#hashtag').on('click', function(e){
        e.preventDefault();
        TweenMax.to(window, 0.3, {scrollTo: '#contact', offsetY:50});
    });

    isMobile.any ? body.addClass('is-mobile') : body.addClass('is-desktop');

    // Since script is loaded asynchronously, load event isn't always fired !!!
    document.readyState === 'complete' ? loadHandler() : $(window).on('load', loadHandler);

    $(window).on('resize', throttle(function(){
        requestAnimFrame(resizeHandler);
    }, 60));

    $(window ).on('beforeunload', function(){
        $(window).scrollTop(0);
    });

});
