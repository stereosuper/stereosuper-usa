var $ = require('jquery-slim');

require('gsap/CSSPlugin');
var TweenLite = require('gsap/TweenLite');

module.exports = function(eye, pupil){
    if (!eye.length) return;

    // // Initialise core variables
    // // var r = pupil.width()/2;
    // // var center = {
    // //   x: eye.width()/2 - r, 
    // //   y: eye.height()/2 - r
    // // };
    // // var distanceThreshold = eye.width()/2 - r;
    // // var mouseX = center.x, mouseY = center.y;

    // // // Listen for mouse movement
    // // $(window).mousemove(function(e){ 
    // //   var d = {
    // //     x: e.pageX - r - eyeposx - center.x,
    // //     y: e.pageY - r - eyeposy - center.y
    // //   };
    // //   var distance = Math.sqrt(d.x*d.x + d.y*d.y);
    // //   if (distance < distanceThreshold) {
    // //     mouseX = e.pageX - eyeposx - r;
    // //     mouseY = e.pageY - eyeposy - r;
    // //   } else {
    // //     mouseX = d.x / distance * distanceThreshold + center.x;
    // //     mouseY = d.y / distance * distanceThreshold + center.y;
    // //   }
    // // });

    // var mouseX = 0, mouseY = 0, xp = 0, yp = 0;
    // var limitX = eye.width() - pupil.width(),
    //     limitY = eye.height() - pupil.height(),
    //     offset = eye.offset();

    // $(window).mousemove(function(e){
    //   mouseX = Math.min(e.pageX - offset.left, limitX);
    //   mouseY = Math.min(e.pageY - offset.top, limitY);
    //   if (mouseX < 0) mouseX = 0;
    //   if (mouseY < 0) mouseY = 0;
    // });

    // // var follower = pupil;
    // // xp += (mouseX - xp) / 8;
    // // yp += (mouseY - yp) / 8;
    // // follower.css({left:xp, top:yp});

    // // var loop = setInterval(function(){
    // //   xp += (mouseX - xp) / 8;
    // //   yp += (mouseY - yp) / 8;
    // //   follower.css({left:xp, top:yp});
    // // }, 30);

    var horizontal = {
        size:  function($el) { return $el.width(); },
        position: function($el) { return $el.position().left; },
        offset:   function($el) { return $el.offset().left; },
        cursor:   function(event) { return event.pageX; },
    };
    var vertical = {
        size:  function($el) { return $el.height(); },
        position: function($el) { return $el.position().top; },
        offset:   function($el) { return $el.offset().top; },
        cursor:   function(event) { return event.pageY; },
    };

    function coordinate(pupil, eye, cursor, axis) {
        var eyeSize = axis.size(eye) - axis.size(pupil);
        var distance = axis.cursor(cursor) +
                    axis.position(pupil) -
                    axis.offset(pupil) -
                    axis.size(pupil) / 2;
        return Math.max(0, Math.min(eyeSize, distance));
    }

    $(document).on('mousemove', function(event) {
        // pupil.css({
        //     left: coordinate(pupil, eye, event, horizontal) + 'px',
        //     top:  coordinate(pupil, eye, event, vertical) + 'px',
        // });
        TweenLite.set(pupil, {
            x: coordinate(pupil, eye, event, horizontal),
            y: coordinate(pupil, eye, event, vertical)
        });
    });
}