const $ = require('jquery-slim');

require('gsap');
const tl = require('./etVoila');

module.exports = function(voila){
    let viewportTop = $(window).scrollTop();
    const OFFSET = 150;
    let done = false;

    const scroller = () => {
        viewportTop = $(window).scrollTop();       
        if(viewportTop + OFFSET >= voila.offset().top && !done){
            tl(voila).play(0);
            done = true;
        } else if(viewportTop + OFFSET < voila.offset().top){
            done = false;
        }
    }

    $(document).on('scroll', function(){
        if (window.matchMedia("(max-width: 960px)").matches) scroller();
    });
    
}