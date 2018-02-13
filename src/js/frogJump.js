import { TimelineMax, TweenMax } from 'gsap';

//import { TweenMax, Power2 } from 'gsap';

const $ = require('jquery-slim');
const throttle = require('./throttle.js');

require('gsap');

module.exports = function(condensed, extended){
    let isScrolling;
    let scrolling = false;
    let scrollTop = $(window).scrollTop();
    let up = false;


    // const tlJump = new TimelineMax({repeat:- 1});
    // tlJump.set(extended, {opacity: 1})
    // .set(condensed, {opacity: 0})
    // .set(extended, {opacity: 0}, 0.2) 
    // .set(condensed, {opacity: 1}, 0.2);

    const jump = () => {
        if(condensed.hasClass('on')){
            TweenMax.set(condensed, {className: '-=on'});
            TweenMax.set(extended, {className: '+=on'});
        }else{
            TweenMax.set(condensed, {className: '+=on'});
            TweenMax.set(extended, {className: '-=on'});
        }
    }

    $(document).on('scroll', throttle(function(){
        if(scrollTop < $(window).scrollTop() && !up){
            // VERS LE BAS
            up = true;
            TweenMax.to($('#frogLink'), 0.2, {rotation: '-180deg'});
        }else if(scrollTop > $(window).scrollTop() && up){
            up = false;
            TweenMax.to($('#frogLink'), 0.2, {rotation: '0deg'});
        }
        jump();
        
        scrollTop = $(window).scrollTop();

    }, 60));

};