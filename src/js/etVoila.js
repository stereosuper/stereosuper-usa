//import { TweenMax, Power2 } from 'gsap';

const $ = require('jquery-slim');
require('gsap');

module.exports = function(voila){
    const music = voila.find('.music');
    const letters = voila.find('.big-voila > span');
    const honey = voila.find('.honey > span');
    const ready = voila.find('.ready > span');
    const voilaTl = new TimelineMax({paused: true});
    const reverseTl = new TimelineMax({paused: true, onComplete: function(){
        voilaTl.play(0);
    }});

    voilaTl.add([
        TweenMax.to( music, 0.2, {opacity: 1}),
        TweenMax.to( music, 0.6, {scale: 1, ease: Back.easeOut.config(1.5)}),
        TweenMax.staggerTo(letters, 0.2, {y: 0, opacity:1, ease: Power2.easeInOut, delay: 0.3}, 0.02),
        TweenMax.staggerTo(honey, 0.25, {scale:1, y: 0, opacity:1, ease: Power2.easeOut, delay: 0.6}, 0.05),
        TweenMax.staggerTo(ready, 0.25, {scale:1, y: 0, opacity:1, ease: Power2.easeOut, delay: 0.9}, 0.05)
    ]);

    reverseTl.to(honey, 0.2, {opacity:0, ease: Power2.easeOut})
    .to(honey, 0, {scale:0.7, y:15})        
    .to(ready, 0.2, {opacity:0, ease: Power2.easeOut})
    .to(ready, 0, {scale:0.7, y:15})
    .to(letters, 0.1, {opacity:0, ease: Power2.easeOut})
    .to(letters, 0, {y:15})
    .to(music, 0.1, {scale: 0.5, ease: Power2.easeOut, delay: -0.1})
    .to(music, 0.05, {opacity: 0, ease: Power2.easeOut, delay: -0.05});
        

    return reverseTl;
}