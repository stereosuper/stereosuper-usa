import { TweenMax } from 'gsap';

const $ = require('jquery-slim');
require('gsap');
window.requestAnimFrame = require('./requestAnimFrame.js');
const animSlurp = require('./animSlurp');

let fly;
let frog;
let trigger;
let bLayers;

const MAGIC_NUMBER = 4;
let hasOrientation = false;
let o = {}, n = {}, a = {};
let timeToWaitRotation;
let eaten = false;
let oldX = 0, oldY = 0, newX, newY, angleDeg, oldAngleDeg;
let orientation;

let tlFrog;



const init = function(scene, isMobile, parent){
    if(!scene.length || !isMobile) return ;
    fly = parent.find('#fly');
    frog = parent.find('#frog');
    trigger = parent.find('#triggerFly');
    tlFrog = animSlurp(frog);
    
    bLayers = scene.find('.layer');
    orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';

    window.addEventListener('deviceorientation', orientationListener, false);

    $(window).on('orientationchange', function() {
        clearTimeout(timeToWaitRotation);
        orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
        timeToWaitRotation = setTimeout(function(){
            initGyro(a);
            
        }, 1000);
    });
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

const initGyro = e => {
    if(e.alpha !== -0 && e.beta !== 0 && e.gamma !== -0){
        o = {
            alpha: e.alpha,
            beta: e.beta,
            gamma: e.gamma
        };
        hasOrientation = true;        
        TweenMax.set(fly, {
            top: '50%',
            left: '50%'
        });
        TweenMax.to(fly, 0.3, {opacity: 1});
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

const orientationListener = e => {
    orientationHandler(e);
};

const kill = () => {
    window.removeEventListener('deviceorientation', orientationListener, false);
    TweenMax.killAll();
    hasOrientation = false;
    eaten = false;
};

module.exports = {
    init: init,
    kill: kill
};