let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;
const touchOffset = 20
const gestureZone = document.getElementById('gestureZone');
gestureZone.addEventListener('touchstart', function(event) {
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
}, false);

gestureZone.addEventListener('touchend', function(event) {
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    if (event.target.className && event.target.className.indexOf('splide') > -1) { } else {
        handleGesture();
    }
}, false); 

function handleGesture() {
    const absX = Math.abs(touchstartX - touchendX)
    const absY = Math.abs(touchstartY - touchendY)

    if (absX > touchOffset) {
        if (touchendX <= touchstartX) {
            // console.log('Swiped left');
            index-=2
            cycle()
        }
        
        if (touchendX >= touchstartX) {
            // console.log('Swiped right');
            cycle()
        }
    }

    if (absY > touchOffset) {
        if (touchendY <= touchstartY) {
            // console.log('Swiped up');
            
        }
        
        if (touchendY >= touchstartY) {
            // console.log('Swiped down');

        }
    }
    
    if (touchendY === touchstartY) {
        // console.log('Tap');
    }
}