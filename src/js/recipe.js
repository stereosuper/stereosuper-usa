const $ = require('jquery-slim');

const throttle = require('./throttle.js');

require('gsap/CSSPlugin');
const TweenLite = require('gsap/TweenLite');

module.exports = function(){
    const recipe = $('#recipe');
    const sheets = $('.container-sheet');
    const sheet1 = $('.container-sheet[data-sheet="1"]');
    const sheet2 = $('.container-sheet[data-sheet="2"]');
    const sheet3 = $('.container-sheet[data-sheet="3"]');
    const sheet4 = $('.container-sheet[data-sheet="4"]');

    let maxHeight = sheet2.height();

    if(window.outerWidth < 960){
        $('.container-sheet>div').css('height', 'auto');
        sheets.removeClass('stuck').addClass('release');
    }else{
        $('.container-sheet>div').css('height', maxHeight + 'px');
    }

    const TIMING_1 = 0;
    let TIMING_2 = TIMING_1 + maxHeight;
    let TIMING_3 = TIMING_2 + maxHeight;
    let TIMING_4 = TIMING_3 + maxHeight;

    let inRecipe = false;

    let lastRelease = 0;
   
    let windowHeight = $(window).height();
    let windowWidth = window.outerWidth;
    let elementTop = recipe.offset().top;
    let viewportTop = $(window).scrollTop();
    let offsetTop = (windowHeight - maxHeight)/2;

    const releaseSheet = (et, ot, vt) => {
        sheets.each(function(i) {
            const actualTiming = eval('TIMING_'+(i+1));
            if(vt >= et - ot + actualTiming){
                if( lastRelease < i+1 )lastRelease++;
                if($(this).hasClass('stuck') && !$(this).hasClass('release')) $(this).removeClass('stuck').addClass('release');
            }else{
                if( lastRelease === i+1 ){
                    lastRelease--;
                    $(this).addClass('stuck').removeClass('release');
                }                
            }
        });
        
    }

    const scroller = () => {
        windowHeight = $(window).height();
        elementTop = recipe.offset().top;
        viewportTop = $(window).scrollTop();
        offsetTop = (windowHeight - maxHeight)/2;
        if(elementTop - offsetTop <= viewportTop){
            if(!inRecipe){
                inRecipe = true;
                sheets.addClass('stuck').removeClass('release');
            }
            releaseSheet(elementTop, offsetTop, viewportTop);
        }else{
            inRecipe = false;
            sheets.removeClass('stuck release');
        }
    }

    $(document).on('scroll', throttle(function(){
        if(window.outerWidth > 960) scroller();
    }, 10));

    $(window).on('resize', throttle(function(){


        

        maxHeight = sheet2.height();


        TIMING_2 = TIMING_1 + maxHeight;
        TIMING_3 = TIMING_2 + maxHeight;
        TIMING_4 = TIMING_3 + maxHeight;

        inRecipe = false;

        lastRelease = 0;
    
        windowHeight = $(window).height();
        windowWidth = window.outerWidth;
        elementTop = recipe.offset().top;
        viewportTop = $(window).scrollTop();
        offsetTop = (windowHeight - maxHeight)/2;

        if(window.outerWidth < 960){
            $('.container-sheet>div').css('height', 'auto');
            sheets.removeClass('stuck').addClass('release');
        }else{
            $('.container-sheet>div').css('height', maxHeight + 'px');
            scroller();
        }
        
    }, 60));
   
}