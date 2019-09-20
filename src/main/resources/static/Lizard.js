class Lizard {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = getContext(canvas);
        this.s = 3;
        this.r = 28;
        this.x = rWidth / 2;
        this.y = rHeight - this.r - 5;
        this.isDirectKeyPress = false;
        this.directKey = undefined;
        this.moveX = undefined;
        this.isInputKeyPress = false;
        this.inputKey = undefined;
        this.bulletItemList = [ new StrongBullet(canvas), new BasicBullet(canvas) ];
        this.fireTerm = 0;
        this.isLive = true;
    };

    onKeyDirectEvent = (eventName, key) => {
        this.isDirectKeyPress = eventName == 'keydown';
        this.directKey = this.isDirectKeyPress ? key : undefined;
    };

    onKeyInputEvent = (eventName, key) => {
        if (key != 'w') {
            return;
        }
        this.isInputKeyPress = eventName == 'keydown';
        this.inputKey = this.isInputKeyPress ? key : undefined;
    };

    onTouchEvent = (eventName, x) => {
        switch (eventName) {
            case 'touchstart' :
                this.isInputKeyPress = true;
                this.inputKey = 'w';
                break;
            case 'touchmove' :
                this.isDirectKeyPress = true;
                this.moveX = x;
                break;
            default :
                this.isInputKeyPress = false;
                this.inputKey = undefined;
                this.isDirectKeyPress = false;
                this.moveX = undefined;
                break;
        }
    };

    calPosition = () => {
        this.moveBody();
        this.fireBullet();
        this.bulletItemList.forEach(bulletItem => bulletItem.calPosition());
    };

    moveBody = () => {
        if (!this.isDirectKeyPress) {
            return;
        }

        let { x, s, r } = this;
        if (this.directKey) {
            this.x = (this.directKey == 'left' ? Math.max(x-s, r) : Math.min(x+s, rWidth - r));
        } else if (this.moveX) {
            this.x = Math.max(r, Math.min(rWidth - r, x + this.moveX));
        }
    };

    fireBullet = () => {
        if (this.fireTerm > 0) {
            this.fireTerm--;
            return;
        }

        if (this.isInputKeyPress && this.inputKey == 'w') {
            let list = this.bulletItemList.filter(item => !item.isEmpty());
            list[0].registOne(this.x, this.y - this.r - 0.5);
            this.fireTerm = list[0].fireTerm;
        }
    };

    addBulletItem = (bullet) => {
        this.bulletItemList.forEach(item => item.limit = 0);
        this.bulletItemList.unshift(bullet);
    };

    judgeCollision = (enemyRow) => {
        let { y, r } = enemyRow.enemyData;
        let top = y - r, bottom = y + r;
        if (this.y - this.r <= bottom || this.y + this.r >= top) {
            this.isLive = !enemyRow.enemyList.some(e => isCollisionArc(e, this));
        }
    };

    render = () => {
        this.bulletItemList.forEach(bulletItem => bulletItem.render());
        this.drawBody();
        this.drawEyes();

        this.bulletItemList = this.bulletItemList.filter(bulletItem => !bulletItem.outOfView || !bulletItem.isEmpty());
    };

    drawEyes = () => {
        let { x, y } = this;
        this.context.beginPath();
        this.context.arc(x-13, y-10, 7, 0, Math.PI*2, false);
        this.context.arc(x+13, y-10, 7, 0, Math.PI*2, false);
        this.context.fillStyle = '#b4ddfc';
        this.context.fill();
        this.context.closePath();

        this.context.beginPath();
        this.context.arc(x-11, y-13, 2, 0, Math.PI*2, false);
        this.context.arc(x+11, y-13, 2, 0, Math.PI*2, false);
        this.context.fillStyle = '#200e09';
        this.context.fill();
        this.context.closePath();
    };

    drawBody = () => {
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
        this.context.fillStyle = '#5FAA23';
        this.context.fill();
        this.context.strokeStyle = "rgba(0, 0, 255, 0.5)";
        this.context.stroke();
        this.context.closePath();
    };
}