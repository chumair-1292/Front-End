const cord = document.getElementById('cord');
const body = document.body;

// Click or tap to toggle the lamp state
cord.addEventListener('click', () => {
    body.classList.toggle('light-on');
});

// Support mobile touch/swipe down gestures on the lamp cord
let startY = 0;

cord.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
});

cord.addEventListener('touchend', (e) => {
    let endY = e.changedTouches[0].clientY;
    // If swiped down past threshold, toggle state
    if (endY - startY > 15) {
        body.classList.toggle('light-on');
    }
});