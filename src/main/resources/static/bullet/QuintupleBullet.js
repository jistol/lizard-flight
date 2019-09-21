class QuintupleBullet extends BasicBullet {
    constructor(canvas) {
        super(canvas);
        this.seq = 0;
        this.s = 6.5;
        this.r = 5;
        this.damage = 35;
        this.fireTerm = 15;
        this.fireUnit = 5;
        this.collisionTime = 5;
        this.outOfView = false;
        this.bulletList = [];
        this.iconTxt = 'Q';
        this.fireColor = '#fedda9';
        this.fireStrokeColor = '#c8c476';
        this.nolimit = false;
        this.limit = 100;
    };

    calPositionBullet = (bullet) => {
        bullet.y -= this.s;
        bullet.x += (bullet.fireSeq - 3) * 1.5;
        console.log(bullet.x);
        bullet.outOfView = bullet.y - bullet.r <= 0;
    };
}