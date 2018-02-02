//import { TweenMax, Power2 } from 'gsap';

const $ = require('jquery-slim');
require('gsap');

module.exports = function(refs){
    let loop = true;
    let under;
    let windowWidth = window.outerWidth;
    if(windowWidth > 960){
        run(refs);
        under = false;
    }else if(window.matchMedia("(max-width: 580px)").matches){
        mobile(refs);
        under = false;
    }else{
        under = true;
    }
    function run (references) {
        loop = !loop;
        references.each(function(i){
            const coeff = (i + loop) % 2 ? -1 : 1;
            TweenMax.to($(this), 0.6, { x: 0, y: coeff * 10 + (Math.random() * 5 - 5), ease: Power2.easeInOut});
        });
        if(windowWidth > 960) TweenMax.delayedCall(1, run, [references]);
    }

    function mobile (references) {
        loop = !loop;
        references.each(function(i){
            const coeff = (i + loop) % 2 ? -1 : 1;
            TweenMax.to($(this), 0.6, { y: 0, x: coeff * 10 + (Math.random() * 5 - 5), ease: Power2.easeInOut});
        });
        
        if(window.matchMedia("(max-width: 580px)").matches) TweenMax.delayedCall(1, mobile, [references]);
    }

    $(window).on('resize', function(){
        windowWidth = window.outerWidth;
        if(windowWidth < 960 && window.matchMedia("(min-width: 581px)").matches && !under){
            TweenMax.to(refs, 0.6, {x: 0, ease: Power2.easeInOut});
            under = true;
        }else if(windowWidth > 960 && under){
            under = false;
            TweenMax.delayedCall(1, run, [refs])
        }else if(window.matchMedia("(max-width: 580px)").matches && under){
            under = false;
            TweenMax.delayedCall(1, mobile, [refs])
            
        }
    });
}