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
            return new BasicPlay(canvas, data);
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

