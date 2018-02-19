'use strict';

const $ = require('jquery-slim');
const isMobile = require('ismobilejs');

const Barba = require('barba.js');

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
    const transitionIn = require('./transitionIn.js');
    const recipe = require('./recipe.js');
    const transition = require('./transition.js');
    const gyro = require('./gyro.js');
    const animRefs = require('./animRefs.js');

    var body = $('body');
    // window.outerWidth returns the window width including the scroll, but it's not working with $(window).outerWidth
    var windowWidth = window.outerWidth, windowHeight = $(window).height();

    const load = $('#load');
    const overlay = $('#firstO');
    const baseline = $('#baseline');

    TweenMax.delayedCall(2, function(){
        if(baseline.length){
            baseline.imagesLoaded( function() {
                transitionIn(body, $('.barba-container'), load, overlay);
            });
        }
    });


    function resizeHandler(){
        windowWidth = window.outerWidth;
        windowHeight = $(window).height();
    }

    const loadHandler = () => {

    };


    const CommonView = Barba.BaseView.extend({ namespace: 'common',
        onEnterCompleted: function(){
            const frogLink = $(this.container).find('#frogLink');
            const condensed = frogLink.find('#iconFrog');
            const extended = frogLink.find('#iconFrog2');
            const visuFrog = $(this.container).find('#visuFrog');
            const bubble1 = $(this.container).find('#bubble1');
            const bubble2 = $(this.container).find('#bubble2');
            const bubble3 = $(this.container).find('#bubble3');

            recipe(isMobile.any);
            frogJump(condensed, extended);
            animFrog(visuFrog, isMobile.any);
            etVoilaMobile($(this.container).find('#voila'));
            animBubble(bubble1, 5.4);
            animBubble(bubble2, 6.1);
            animBubble(bubble3, 9.3);
            animRefs($(this.container).find('.reference'));
            gyro($(this.container).find('#baseline, #contact'), isMobile.any);

            $(this.container).find('#contactLink').on('mouseenter', function(){
                TweenMax.to($(this.container).find('#contactRect'), 0.6, {scale: 0.95, ease: Elastic.easeOut.config(1, 0.2)});
            }).on('mouseleave', function(){
                TweenMax.to($(this.container).find('#contactRect'), 0.1, {scale: 1, ease: Power1.easeInOut});
            });
        
            $(this.container).find('#toRecipe').on('click', function(e){
                e.preventDefault();
                TweenMax.to(window, 0.3, {scrollTo: '#recipe', offsetY:50});
            });
            $(this.container).find('#hashtag').on('click', function(e){
                e.preventDefault();
                TweenMax.to(window, 0.3, {scrollTo: '#contact', offsetY:50});
            });
        },

        onLeave: function(){
            $(this.container).find('#contactLink').off();
            $(this.container).find('#toRecipe').off();
            $(this.container).find('#hashtag').off();
        }
    });



    const Cuisine = CommonView.extend({ namespace: 'cuisine',
        onEnterCompleted: function(){
            CommonView.onEnterCompleted.apply(this);
            console.log('cuisineEnter');
            
        }
    });
    Cuisine.init();

    const CuisineEn = CommonView.extend({ namespace: 'cooking',
        onEnterCompleted: function(){
            CommonView.onEnterCompleted.apply(this);
            console.log('cookngEnter');
            
        }
    });
    CuisineEn.init();
    

    if( $('#barba-wrapper').length ){
        Barba.Pjax.start();
        Barba.Pjax.getTransition = () => {
            return transition(load, overlay, body);
        };
        Barba.Dispatcher.on('linkClicked', e => {
            Barba.Pjax.getTransition = function(){
                return transition(load, overlay, body, $(e));
            };
        });
    }

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
