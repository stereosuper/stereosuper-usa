const $ = require('jquery-slim');
const Barba = require('barba.js');

require('gsap');

const transitionIn = require('./transitionIn.js');

module.exports = function(load, overlay, body){
    return Barba.BaseTransition.extend({
        start: function(){
                Promise
                .all([this.newContainerLoading, this.fadeOut()])
                .then(this.fadeIn.bind(this));
        },
        fadeOut: function(){
            const tl = new TimelineMax();
            const $el = $(this.oldContainer);
            return new Promise( function(resolve, reject){
                tl.set(load, {scaleY: 0})
                .set(body, {className: '+=off'})
                .set(load, {css: {zIndex: 6, display: 'block'}})
                .set(load.find('.inner-load'), {y: 50, opacity: 0})
                .to(load, 1, {ease: Power4.easeInOut, scaleY: 1})
                .to(load.find('.inner-load'), 1, {ease: Power4.easeInOut, y: 0, delay: -0.8, opacity: 1, onComplete: function(){
                    $(window).scrollTop(0);
                    resolve(true);
                }});
            });
        },

        fadeIn: function(){
            const _this = this;
            const $el = $(this.newContainer);
           
            TweenLite.set($el, {visibility: 'visible'});
            $(this.oldContainer).hide();

            return transitionIn(body, $el, load, overlay, _this);

        }
    });
};