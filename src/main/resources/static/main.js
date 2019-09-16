'use strict';
const worker = new Worker('./worker.js');

const onloadEvent = () => {
    let body = document.body;
    let canvas = document.getElementById('mainCanvas');
    canvas.width = body.clientWidth;
    canvas.height = Math.min(body.clientWidth * 1.5, body.clientHeight);

    document.addEventListener('keydown', onkeyEvent('keydown'), false);
    document.addEventListener('keyup', onkeyEvent('keyup'), false);

    const offscreen = canvas.transferControlToOffscreen();
    worker.postMessage({ type : 'init', canvas : offscreen }, [offscreen]);
};

const onkeyEvent = eventName => event => {
    if(event.key == "Right" || event.key == "ArrowRight") {
        worker.postMessage({ type : 'keyDirect', eventName : eventName, key : 'right' });
    } else if(event.key == "Left" || event.key == "ArrowLeft") {
        worker.postMessage({ type : 'keyDirect', eventName : eventName, key : 'left' });
    } else if(event.key == ' ' || event.key == 'Spacebar') {
        worker.postMessage({ type : 'keyInput', eventName : eventName, key : 'space' });
    } else if(event.key == 'Enter') {
        worker.postMessage({ type : 'keyInput', eventName : eventName, key : 'enter' });
    }
};

const onunloadEvent = () => {
    worker.terminate();
};


(function(){
    let body = document.body;
    body.addEventListener('unload', onunloadEvent);
    body.style.width = '100%';
    body.style.height = '100%';
    body.style.margin = '0';
    body.style.padding = '0';

    onloadEvent();
})();






