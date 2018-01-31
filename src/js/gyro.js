const $ = require('jquery-slim');
const TweenLite = require('gsap/TweenLite');
const mapRange = require('./mapRange')

module.exports = function(scene){
    
    const bLayers = scene.find('.layer');

    const MAGIC_NUMBER = 30;
    let hasOrientation = false;
    let o = {};
    let n = {};

    const initGyro = e => {
        hasOrientation = true;
        o = {
            alpha: e.alpha,
            beta: e.beta,
            gamma: e.gamma
        }        
    }

    const parallax = (e, layers) => {
        n = {
            alpha: o.alpha - e.alpha,
            beta: o.beta - e.beta,
            gamma: o.gamma - e.gamma,
        }
        
        layers.each(function(){
            const x = (n.alpha/4) * ($(this).data('gyro') * -4);

            const y = (n.beta/4) * ($(this).data('gyro') * -4);

            console.log(x,y);


            TweenLite.set($(this), {x: x, y: y})
        });
        

        
    }

    const orientationHandler = e => {
        !hasOrientation ? initGyro(e) : parallax(e, bLayers);
    }

    window.addEventListener("deviceorientation", orientationHandler, true);

}