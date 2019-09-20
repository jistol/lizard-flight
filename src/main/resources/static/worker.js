importScripts('./Animation.js');
importScripts('./ItemManager.js');
importScripts('./Lizard.js');
importScripts('./BgCosmos.js');
importScripts('./PlayManager.js');
importScripts('./Bullet.js');
importScripts('./BasicBullet.js');
importScripts('./WaveBullet.js');
importScripts('./FastBullet.js');
importScripts('./StrongBullet.js');
importScripts('./Util.js');
importScripts('./Viewer.js');
importScripts('./storyBoard.js');

const viewer = new Viewer();
const render = time => {
    switch (viewer.status) {
        case ViewerStatus.playing :
            viewer.render(); break;
        case ViewerStatus.opening :
            viewer.opening(); break;
        case ViewerStatus.ending :
            viewer.ending(); break;
    }
    requestAnimationFrame(render);
};

const __events = {
    init : event => {
        let canvas = event.data.canvas;
        contextScale(canvas);
        viewer.initialize(canvas);
        requestAnimationFrame(render);
    },
    keyDirect : event => {
        let { eventName, key } = event.data;
        (viewer.onKeyDirectEvent||function(){})(eventName, key);
    },
    keyInput : event => {
        let { eventName, key } = event.data;
        if (key == 'enter' && viewer.status != ViewerStatus.playing) {
            viewer.playing();
        } else {
            (viewer.onKeyInputEvent || function(){})(eventName, key);
        }
    },
    touchEvent : event => {
        let { eventName, x } = event.data;
        if (eventName == 'touchend' && viewer.status != ViewerStatus.playing) {
            viewer.playing();
        } else {
            (viewer.onTouchEvent || function(){})(eventName, x);
        }
    }
};

self.onmessage = event => {
    let type = event.data.type;

    if (!type || !__events[type]) {
        return;
    }

    __events[event.data.type](event);
};

