const $ = require('jquery-slim');
const TweenLite = require('gsap/TweenLite');

module.exports = function(){
    
    let hasOrientation = false;

    const orientationHandler = e => {
        if(!hasOrientation) hasOrientation = true;
        if(e.gamma && e.gamma <= 45 && e.gamma >= -45){
            console.log(e.alpha, e.beta, e.gamma)
        }
    }

    window.addEventListener("deviceorientation", orientationHandler, true);

}