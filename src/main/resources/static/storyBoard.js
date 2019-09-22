const enemyAbility = {
    EMPTY : {},
    GRAY : {
        clazz : BasicEnemy,
        play : BasicPlay,
        s : 4,
        hp : 100,
        score : 5,
        bodyStyle : '#989898',
        bodyStrokeStyle : '#909090'
    },
    YELLOW : {
        clazz : BasicEnemy,
        play : BasicPlay,
        s : 4,
        hp : 150,
        score : 7,
        bodyStyle : '#e9de12',
        bodyStrokeStyle : '#dbd018'
    },
    RED : {
        clazz : BasicEnemy,
        play : FollowPlay,
        s : 4,
        hp : 300,
        score : 10,
        bodyStyle : '#981a1e',
        bodyStrokeStyle : '#76514f'
    },
    SKY : {
        clazz : BasicEnemy,
        play : NoWaitPlay,
        s : 5,
        hp : 150,
        score : 15,
        bodyStyle : '#09bac3',
        bodyStrokeStyle : '#557376'
    },
    GOLD : {
        clazz : BasicEnemy,
        play : BasicPlay,
        s : 3,
        hp : 550,
        score : 17,
        wait : 300,
        bodyStyle : '#c39834',
        bodyStrokeStyle : '#764e21'
    },
    WHITE : {
        clazz : BasicEnemy,
        play : NoWaitPlay,
        s : 6,
        hp : 150,
        score : 15,
        bodyStyle : '#beaec3',
        bodyStrokeStyle : '#f7f6ff'
    },
    BLUE : {
        clazz : BasicEnemy,
        play : BasicPlay,
        s : 5.5,
        hp : 450,
        score : 15,
        wait : 100,
        bodyStyle : '#383dfb',
        bodyStrokeStyle : '#7a98ff'
    },
    ORANGE : {
        clazz : BasicEnemy,
        play : BasicPlay,
        s : 5.5,
        hp : 350,
        score : 15,
        wait : 100,
        bodyStyle : '#fba100',
        bodyStrokeStyle : '#ffe4b2'
    }
};

const story = (function(){
    let { GRAY, YELLOW, RED, SKY, GOLD, WHITE, BLUE, ORANGE, EMPTY } = enemyAbility;
    let genOpening = level => Object.assign({
        message : 'Level ' + level,
        bgStyle : 'rgba(0,128,0,0.2)',
        fontStyle : '#ffdb2a'
    });
    let ending = {
        message : 'MISSION COMPLETE',
        bgStyle : 'rgba(0,128,0,0.2)',
        fontStyle : '#ffdb2a'
    };
    let genStory = level => (...waveList) => (step, ...items) => ({
            opening : genOpening(level),
            ending : ending,
            itemRule : { step : step, itemList : items},
            waveList : waveList
    });
    let merge = (enemy, opt) => Object.assign({}, enemy, opt);

    return [
        genStory(1)(
            [GRAY, RED, GRAY, RED, GRAY],
            [GRAY, YELLOW, EMPTY, YELLOW, GRAY],
            [GRAY, merge(SKY, {y:-50}), GRAY, merge(SKY, {y:-50}), GRAY],
            [SKY, merge(WHITE, {y:-120}), SKY, merge(WHITE, {y:-120}), SKY],
            [GRAY, SKY, GRAY, YELLOW, YELLOW]
        )(20, FastBullet, WaveBullet)
    ];
})();

const storyBoard = {
    version : 1,
    title : 'Lizard Flight',
    txt : {
        opening : {
            message : 'Lizard Flight',
            fontStyle : '#71ff7d',
            bgStyle : 'rgba(0,128,0,0.2)',
            usePressKey : true
        },
        dead : {
            message : 'YOU DIED',
            fontStyle : '#c80000',
            bgStyle : 'rgba(128,0,0,0.2)',
            usePressKey : true
        },
        ending : {
            message : 'THE END',
            fontStyle : '#113dff',
            bgStyle : 'rgba(20,20,20,0.2)',
            usePressKey : true
        }
    },
    story : story
};