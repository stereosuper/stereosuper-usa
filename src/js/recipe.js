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

    var TIMING_1 = 50;
    var TIMING_2 = 550;
    var TIMING_3 = 1050;
    var TIMING_4 = 1550;

    let inRecipe = false;
   
    
    
    let windowHeight = $(window).height();
    let elementTop = recipe.offset().top;
    let viewportTop = $(window).scrollTop();


    let offsetTop = (windowHeight - recipe.outerHeight())/2;

    const releaseSheet = (et, ot, vt) => {
        sheets.each(function(i) {
            const actualTiming = eval('TIMING_'+(i+1));
            if(vt >= et - ot + actualTiming){
                $(this).removeClass('stuck').addClass('release');
                $(this).css('top', '');
            }else{
                $(this).addClass('stuck').removeClass('release');
                $(this).css('top', offsetTop+'px');
            }
        });
        
    }

    const scroller = () => {


        windowHeight = $(window).height();
        elementTop = recipe.offset().top;
        viewportTop = $(window).scrollTop();
        offsetTop = (windowHeight - recipe.outerHeight())/2;


        if(elementTop - offsetTop <= viewportTop){
            if(!inRecipe){
                inRecipe = true;
                sheets.addClass('stuck').removeClass('release');
                sheets.css('top', offsetTop+'px');
            }
            releaseSheet(elementTop, offsetTop, viewportTop);
            
            
        }else{
            inRecipe = false;
            sheets.removeClass('stuck');
            sheets.css('top', '');
        }




    }

    $(document).on('scroll', throttle(function(){
        scroller();
    }, 60));

    $(window).on('resize', throttle(function(){
        windowHeight = $(window).height();
        elementTop = recipe.offset().top;
        viewportTop = $(window).scrollTop();
        offsetTop = (windowHeight - recipe.outerHeight())/2;
    }, 60));
   
}