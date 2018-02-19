require('gsap');
const $ = require('jquery-slim');

module.exports = function(body, $el, load, overlay, promise){

    const tl = new TimelineMax({ onComplete: function(){
        if(promise !== undefined){
    	    promise.done();
    	}
    }});

    tl.set(load, {css: {zIndex: -2}})
    .set(overlay, {scaleY: 0})
    .set(overlay, {css: {display: 'block'}})
    .to(overlay, 1, {ease: Power4.easeInOut, scaleY: 1})
    .set($el.find('#visuFrog'), {opacity: 1})
    .to($el.find('#secondO'), 1, {ease: Power4.easeInOut, scaleY: 0, transformOrigin:'center bottom'})
    .to($el.find('#baselineTxt'), 1, {ease: Power4.easeInOut, opacity: 1, y:0, delay: -1})
    .to($el.find('#headerLeft'), 1, {ease: Power4.easeInOut, opacity: 1, y:0, delay: -0.5})
    .to($el.find('#headerRight'), 1, {ease: Power4.easeInOut, opacity: 1, y:0, delay: -0.6})
    .to($el.find('#lateralLeft'), 1, {ease: Power4.easeInOut, opacity: 1, x:0, delay: -1})
    .to($el.find('#lateralRight'), 1, {ease: Power4.easeInOut, opacity: 1, x:0, delay: -1})
    .set(body, {className: '-=off'})
    .set($el.find('#firstO, #secondO'), {css:{ display: 'none'}})
    .set(load, {css:{ display: 'none'}})      
    .to($el.find('#recipe'), 1, {ease: Power4.easeInOut, opacity: 1, delay: -0.4});
};