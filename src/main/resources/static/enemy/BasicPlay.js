class BasicPlay {
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

