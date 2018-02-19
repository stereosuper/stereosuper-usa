//import { TweenMax, Power2 } from 'gsap';

// const $ = require('jquery-slim');
require('gsap');

module.exports = function(frog){
    if(!frog.length) return;

    const reinitFrog = () => {
        tlFrog.pause(0);
    };


    const cols = 4;
    const rows = 4;
    const gridWidth = 33.333333;
    const gridHeight = 33.333333;
    const interval = 0.03;

    const tlFrog = new TimelineMax({paused: true, onComplete: reinitFrog});

    let count = 0, xpos, ypos;
    for (let r = 0; r < rows; r++){
        for (let c = 0; c < cols; c++){ 
            xpos = c * gridWidth;
            ypos = r * gridHeight;
            tlFrog.set(frog, {backgroundPosition: xpos + '% ' +  ypos + '%'}, count * interval);
            count++;
        }
    }

    return tlFrog;


};