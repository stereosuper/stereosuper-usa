import { TimelineMax, Power2, TweenMax } from 'gsap';

const $ = require('jquery-slim');

const throttle = require('./throttle.js');

require('gsap');
const tl = require('./etVoila');

module.exports = function(isMobile){
    const recipe = $('#recipe');
    const sheets = $('.container-sheet');
    const sheet1 = $('.container-sheet[data-sheet="1"]');
    const sheet2 = $('.container-sheet[data-sheet="2"]');
    const sheet3 = $('.container-sheet[data-sheet="3"]');
    const sheet4 = $('.container-sheet[data-sheet="4"]');
    const voila = $('#voila');

    let maxHeight = sheet2.height();
    
    if (window.matchMedia("(max-width: 960px)").matches || isMobile) {
        $('.container-sheet>div').css('height', 'auto');
        sheets.removeClass('stuck').addClass('release');
    } else {
        $('.container-sheet>div').css('height', maxHeight + 'px');
    }
    let TIMING = [0, maxHeight, maxHeight*2, maxHeight*3];
    let inRecipe = false;
    let lastRelease = 0;
    let windowHeight = window.innerHeight;
    let windowWidth = window.outerWidth;
    let elementTop = recipe.offset().top;
    let viewportTop = $(window).scrollTop();
    let offsetTop = (windowHeight - maxHeight)/2;

    const etVoila = () => {
        tl(voila).play(0);
    }

    const releaseSheet = (et, ot, vt) => {
        sheets.each(function(i) {
            const actualTiming = TIMING[i];
            if(vt >= et - ot + actualTiming){
                if( lastRelease < i+1 )lastRelease++;
                if($(this).hasClass('stuck') && !$(this).hasClass('release')){
                    $(this).removeClass('stuck').addClass('release');
                    if(i === 3) etVoila();
                }
            }else{
                if( lastRelease === i+1 ){
                    lastRelease--;
                    $(this).addClass('stuck').removeClass('release');
                }                
            }
        });
    }

    const scroller = () => {
        viewportTop = $(window).scrollTop();
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

    $(document).on('scroll', function(){
        if (window.matchMedia("(min-width: 961px)").matches && !isMobile) scroller();
    });

    $(window).on('resize', function(){
        maxHeight = sheet2.height();
        TIMING = [0, maxHeight, maxHeight*2, maxHeight*3];
        inRecipe = false;
        lastRelease = 0;
        windowHeight = window.innerHeight;
        windowWidth = window.outerWidth;
        elementTop = recipe.offset().top;
        viewportTop = $(window).scrollTop();
        offsetTop = (windowHeight - maxHeight)/2;
        if (window.matchMedia("(max-width: 960px)").matches || isMobile) {
            $('.container-sheet>div').css('height', 'auto');
            sheets.removeClass('stuck').addClass('release');
        } else {
            $('.container-sheet>div').css('height', maxHeight + 'px');
            scroller();
        }
    });
}