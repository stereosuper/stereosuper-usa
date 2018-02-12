const $ = require('jquery-slim');
require('gsap');
window.requestAnimFrame = require('./requestAnimFrame.js');
const animSlurp = require('./animSlurp');

module.exports = function(scene, isMobile){
    if(scene.length, !isMobile) return;
    
    const bLayers = scene.find('.layer');
    const fly = $('#fly');
    const frog = $('#frog');
    const trigger = $('#triggerFly');

    const MAGIC_NUMBER = 4;
    let hasOrientation = false;
    let o = {};
    let n = {};
    let a = {};
    let timeToWaitRotation;
    let eaten = false;
    let oldX = 0, oldY = 0, newX, newY, angleDeg, oldAngleDeg;    

    const tlFrog = animSlurp(frog);

    let orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';

    const initGyro = e => {
        TweenMax.set(fly, {
            top: '50%',
            left: '50%'
        });
        TweenMax.to(fly, 0.3, {opacity: 1});
        hasOrientation = true;
        o = {
            alpha: e.alpha,
            beta: e.beta,
            gamma: e.gamma
        };
    };

    const reinitFly = () => {
        eaten = false;
        TweenMax.to(fly, 0.3, {opacity: 1});
    };

    const flyMove = e => {
        let actualOrient;
        const flyBoundig = fly[0].getBoundingClientRect();
        const triggerBoundig = trigger[0].getBoundingClientRect();
        
        if(orientation === 'portrait'){
            actualOrient = {
                beta: (o.beta - e.beta),
                gamma: (o.gamma - e.gamma),
            };      
        }else{
            actualOrient = {
                beta: -(o.gamma - e.gamma),
                gamma: -(o.beta - e.beta),
            };
        }

        newX = -actualOrient.gamma * 5;
        newY = -actualOrient.beta * 5;
        angleDeg = (newX === oldX && newY === oldY) ? oldAngleDeg : Math.atan2(newY - oldY, newX - oldX) * 180 / Math.PI;
        

        oldX = newX;
        oldY = newY;
        oldAngleDeg = angleDeg;
        TweenMax.to(fly, 0.1, {x: newX, y: newY, rotation: angleDeg});


        if (flyBoundig.left < triggerBoundig.left + triggerBoundig.width && flyBoundig.left + flyBoundig.width > triggerBoundig.left && flyBoundig.top < triggerBoundig.top + triggerBoundig.height && flyBoundig.height + flyBoundig.top > triggerBoundig.top && !eaten) {
            tlFrog.play(0);
            TweenMax.set(fly, {opacity: 0});            
            eaten = true;
            TweenMax.delayedCall(2, reinitFly);  
        }
    };

    const parallax = (e, layers) => {
        if(orientation === 'portrait'){
            n = {
                beta: (o.beta - e.beta) | 0,
                gamma: (o.gamma - e.gamma) | 0
            };        
        }else{
            n = {
                beta: -(o.gamma - e.gamma),
                gamma: -(o.beta - e.beta)
            };
        }
        
        if (n.gamma > 75 || n.gamma < -75 || n.beta > 75 || n.beta < -75) {
            TweenMax.to(layers, 0.2, {x: 0, y: 0, ease: Power2.easeInOut});
        }else{
            layers.each(function(){
                const x = ((n.gamma/10) * ($(this).data('gyro') * MAGIC_NUMBER));
                const y = ((n.beta/10) * ($(this).data('gyro') * MAGIC_NUMBER));
                TweenMax.to($(this), 0.1, {x: x, y: y, ease: Power2.easeInOut});
            });
        }
    };

    const orientationHandler = e => {
        a = {
            alpha: e.alpha,
            beta: e.beta,
            gamma: e.gamma
        };        
        !hasOrientation ? initGyro(a) : parallax(a, bLayers);
        flyMove(a);
    };
    

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