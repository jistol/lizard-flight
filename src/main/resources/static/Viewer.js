const ViewerStatus = {
    opening : Symbol('opening'),
    playing : Symbol('playing'),
    ending : Symbol('ending'),
    dead : Symbol('dead')
};

class Viewer {
    initialize = canvas => {
        this.status = ViewerStatus.opening;
        this.canvas = canvas;
        this.context = getContext(this.canvas);
        this.background = new BgCosmos(this.canvas, this.context);
    };

    playing = () => {
        this.score = 0;
        this.story = storyBoard.story.concat();
        this.status = ViewerStatus.playing;
        this.lizard = new Lizard(this.canvas);
        this.onKeyDirectEvent = this.lizard.onKeyDirectEvent;
        this.onKeyInputEvent = this.lizard.onKeyInputEvent;
        this.onTouchEvent = this.lizard.onTouchEvent;
        this.playManager = new PlayManager(this.canvas, this.story.shift());
    };

    opening = () => {
        clear(this.context);
        this.background.render();
        renderTxtView(this.canvas, storyBoard.txt.opening);
    };

    ending = () => {
        renderTxtView(this.canvas, storyBoard.txt.ending);
    };

    render = () => {
        clear(this.context);
        this.background.render();
        this.playManager.render();
        this.lizard.render();
        this.renderScore();

        this.calPosition();
        this.judgeCollisionWithBullet();
        this.judgeCollisionWithLizard();
        this.judgeToNext();
    };

    renderScore = () => {
        this.context.beginPath();
        this.context.font = "15px Sans MS";
        this.context.fillStyle = '#FFFFFF';
        this.context.textAlign = "left";
        this.context.fillText(`SCORE : ${this.score}`, 15, 20);
        this.context.closePath();
    };

    calPosition = () => {
        this.lizard.calPosition();
        this.playManager.calPosition();
    };

    judgeToNext = () => {
        if (this.playManager.status == PlayStatus.exit) {
            let story = this.story.shift();
            if (!story) {
                this.status = ViewerStatus.ending;
                return;
            }
            this.playManager = new PlayManager(this.canvas, story);
        }
    };

    judgeCollisionWithLizard = () => {
        if (!this.playManager.currentEnemy) {
            return;
        }

        this.lizard.judgeCollision(this.playManager.currentEnemy);
        if (!this.lizard.isLive) {
            this.status = ViewerStatus.dead;
            renderTxtView(this.canvas, storyBoard.txt.dead);
        }
    };

    judgeCollisionWithBullet = () => {
        this.lizard.bulletItemList.forEach(bulletItem => {
            let result = this.playManager.judgeCollision(bulletItem.bulletList);
            if (result && result.seqList && result.seqList.length > 0) {
                bulletItem.setupCollision(result.seqList);
                this.score += result.score;
            }
        });
    };
}