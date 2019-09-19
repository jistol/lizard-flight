const __initSleepTime = 100;

const PlayStatus = {
    opening : Symbol('opening'),
    playing : Symbol('playing'),
    ending : Symbol('ending'),
    exit : Symbol('exit')
};

class PlayManager {
    constructor(canvas, story) {
        this.sleep = __initSleepTime;
        this.canvas = canvas;
        this.status = PlayStatus.opening;
        this.story = story;
        this.enemyList = (this.story.enemyList || []).map(data => {
            return new EnemyRow(canvas, data);
        });
        this.currentEnemy = this.enemyList.shift();
    }

    [PlayStatus.opening] = () => {
        renderTxtView(this.canvas, this.story.opening);
        this.sleep--;
        if (this.sleep < 1) {
            this.status = PlayStatus.playing;
            this.sleep = __initSleepTime;
        }
    };

    [PlayStatus.playing] = () => {
        if (!this.currentEnemy || this.currentEnemy.outOfView) {
            this.currentEnemy = this.enemyList.shift();
            if (!this.currentEnemy) {
                this.status = PlayStatus.ending;
                return;
            }
        }

        this.currentEnemy.render();
    };

    [PlayStatus.ending] = () => {
        renderTxtView(this.canvas, this.story.ending);
        this.sleep--;
        if (this.sleep < 1) {
            this.status = PlayStatus.exit;
            this.sleep = __initSleepTime;
        }
    };

    render = () => {
        (this[this.status]||function(){})();
    };

    calPosition = () => {
        if (this.status == PlayStatus.playing && this.currentEnemy && !this.currentEnemy.outOfView) {
            this.currentEnemy.calPosition();
        }
    };

    judgeCollision = (bulletList) => {
        if (!this.currentEnemy) {
            return {};
        }

        let { y, r } = this.currentEnemy.enemyData;
        let top = y - r, bottom = y + r;
        let collisionList = bulletList.filter(b => b.status == BulletStatus.fire)
            .filter(b => b.y - b.r <= bottom || b.y + b.r >= top);
        if (!collisionList || collisionList.length < 1) {
            return {};
        }

        return this.currentEnemy.judgeCollision(collisionList);
    };
}

class EnemyRow {
    constructor(canvas, enemyData) {
        let clazz = enemyData.clazz;
        this.canvas = canvas;
        this.enemyData = Object.assign({
            r : 28,
            y : -28,
            s : 3.5,
            hp : 100,
            unit : 5,
            wait : 200,
            nowait : false,
            bodyStyle : '#989898',
            bodyStrokeStyle : '#767676'
        }, enemyData);
        this.waitY = this.enemyData.r + 25;
        this.enemyList = [];
        let x = 40;
        for (let i=0 ; i < 5 ; i++) {
            let opt = Object.assign({}, this.enemyData, { x : x + (i * 80) });
            this.enemyList[i] = new clazz(canvas, opt);
        }
        this.outOfView = false;
        this.initWait = this.enemyData.wait;
    }

    calPosition = () => {
        let { moveX, y } = this.calXY();
        this.outOfView = rHeight <= this.enemyData.y - this.enemyData.r;
        this.enemyList.forEach(enemy => {
            enemy.y = y;
            enemy.x += moveX;
        });
    };

    calXY = () => {
        let moveX = 0;
        let remainWait = this.enemyData.wait > 0;

        if (!this.enemyData.nowait && remainWait) {
            let pi = Math.PI / this.initWait * 2;
            this.enemyData.y += 2.5;
            if (this.enemyData.y > this.waitY) {
                this.enemyData.y = this.waitY;
                this.enemyData.wait--;
                moveX = Math.sin((Math.PI / 2.5) + pi * this.enemyData.wait) / 6;
            }
        } else {
            this.enemyData.y += this.enemyData.s;
        }

        return { moveX : moveX, y : this.enemyData.y };
    };

    render = () => {
        this.enemyList.forEach(enemy => enemy.render());
    };

    judgeCollision = (bulletList) => {
        let score = 0;
        let seqList = bulletList.filter(b => {
                let isAttack = false;
                this.enemyList = this.enemyList.map(e => {
                        if (isCollisionWithBullet(e, b)) {
                            e.damaged(b);
                            isAttack = true;
                        }
                        if (!e.isLive) {
                            score += e.score;
                        }
                        return e;
                    })
                    .filter(e => e.isLive);
                return isAttack;
            })
            .map(b => b.seq);

        return { score : score, seqList : seqList };
    };
}

class BasicEnemy {
    constructor(canvas, { x, y, r, hp, score, bodyStyle, bodyStrokeStyle }) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hp = hp;
        this.score = score;
        this.bodyStyle = bodyStyle;
        this.bodyStrokeStyle = bodyStrokeStyle;
        this.canvas = canvas;
        this.context = getContext(canvas);
        this.isLive = true;
    }

    damaged = ({ damage }) => {
        this.hp -= damage;
        this.isLive = this.hp > 0;
    };

    drawBody = ({context, x, y, r, bodyStyle, bodyStrokeStyle}) => {
        context.beginPath();
        context.arc(x, y, r, 0, Math.PI * 2, false);
        context.fillStyle = bodyStyle;
        context.fill();

        context.strokeStyle = bodyStrokeStyle;
        context.stroke();
        context.closePath();
    };

    drawEyes = ({ context, x, y }, outerEyesStyle, innerEyesStyle) => {
        context.beginPath();
        context.arc(x-12, y+10, 7, 0, Math.PI*2, false);
        context.arc(x+12, y+10, 7, 0, Math.PI*2, false);
        context.fillStyle = outerEyesStyle;
        context.fill();
        context.closePath();

        context.beginPath();
        context.arc(x-11, y+13, 2, 0, Math.PI*2, false);
        context.arc(x+11, y+13, 2, 0, Math.PI*2, false);
        context.fillStyle = innerEyesStyle;
        context.fill();
        context.closePath();
    };

    render = () => {
        // body
        this.drawBody(this);

        // eyes
        let outerEyesStyle = '#FEFEFE';
        let innerEyesStyle = '#090909';
        this.drawEyes(this, outerEyesStyle, innerEyesStyle);
    }
}