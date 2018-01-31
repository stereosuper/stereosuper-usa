const $ = require('jquery-slim');
const TweenLite = require('gsap/TweenLite');

module.exports = function(refs){
    let loop = true;
    let under;
    let windowWidth = window.outerWidth;
    if(windowWidth > 960){
        run(refs);
        under = false;
    }else{
        under = true;
    }
    function run (references) {
        loop = !loop;
        references.each(function(i){
            const coeff = (i + loop) % 2 ? -1 : 1;
            TweenLite.to($(this), 0.6, { y: coeff * 10 + (Math.random() * 5 - 5), ease: Power2.easeInOut});
        });
        if(windowWidth > 960) TweenLite.delayedCall(1, run, [references]);
    }
    $(window).on('resize', function(){
        windowWidth = window.outerWidth;
        if(windowWidth < 960 && !under){
            refs.css('transform', '');
            under = true;
        }else{
            under = false;
        }
    });
}