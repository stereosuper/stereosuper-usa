const $ = require('jquery-slim');
require('gsap');
const mapRange = require('./mapRange');
window.requestAnimFrame = require('./requestAnimFrame.js');

module.exports = function(scene){
    
    const bLayers = scene.find('.layer');

    const MAGIC_NUMBER = 30;
    let hasOrientation = false;
    let o = {};
    let n = {};
    let a = {};
    let timeToWaitRotation;

    let orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';

    const initGyro = e => {
        hasOrientation = true;
        o = {
            alpha: e.alpha,
            beta: e.beta,
            gamma: e.gamma
        }
    }

    const parallax = (e, layers) => {
        if(orientation == 'portrait'){
            n = {
                beta: o.beta - e.beta,
                gamma: o.gamma - e.gamma,
            }
        }else{
            n = {
                beta: -(o.gamma - e.gamma),
                gamma: -(o.beta - e.beta),
            }
        }
        

        if (n.gamma > 75 || n.gamma < -75 || n.beta > 75 || n.beta < -75) {
            TweenMax.to(layers, 0.2, {x: 0, y: 0, ease: Power2.easeInOut})
        }else{
            layers.each(function(){
                const x = (n.gamma/10) * ($(this).data('gyro') * 4);
                const y = (n.beta/10) * ($(this).data('gyro') * 4);
                TweenMax.to($(this), 0.1, {x: x, y: y, ease: Power2.easeInOut})
            });
        }
    }

    const orientationHandler = e => {
        a = {
            alpha: e.alpha,
            beta: e.beta,
            gamma: e.gamma
        };
        !hasOrientation ? initGyro(a) : parallax(a, bLayers);
    }

    window.addEventListener("deviceorientation", function(e){
        requestAnimationFrame(function(){
            orientationHandler(e);
        });        
    }, true);

    window.addEventListener("orientationchange", function(e) {
        clearTimeout(timeToWaitRotation);
        orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
        timeToWaitRotation = setTimeout(function(){
            initGyro(a);
        }, 1000);
    }, false);

}