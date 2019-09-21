class WaveBullet extends BasicBullet {
    constructor(canvas) {
        super(canvas);
        this.seq = 0;
        this.s = 5;
        this.r = 6;
        this.fireTerm = 12;
        this.fireUnit = 2;
        this.damage = 55;
        this.collisionTime = 5;
        this.outOfView = false;
        this.bulletList = [];
        this.iconTxt = 'W';
        this.fireColor = '#15fc28';
        this.fireStrokeColor = '#4e3dfe';
        this.nolimit = false;
        this.limit = 150;
    };

    postConstructBullet = (bullet, fireSeq) => {
        let range = 18 * (fireSeq == 0 ? -1 : 1);
        bullet.moveFun = Animation.wave(this.canvas.height, 12, range, bullet.x + (range/2));
        bullet.y += range/4;
    };

    calPositionBullet = (bullet) => {
        bullet.y -= this.s;
        bullet.x = bullet.moveFun(bullet.y);
        bullet.outOfView = bullet.y - bullet.r <= 0;
    };
}