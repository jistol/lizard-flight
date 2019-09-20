class WaveBullet extends BasicBullet {
    constructor(canvas) {
        super(canvas);
        this.seq = 0;
        this.s = 5;
        this.r = 5;
        this.fireTerm = 10;
        this.damage = 45;
        this.collisionTime = 5;
        this.outOfView = false;
        this.bulletList = [];
        this.iconTxt = 'W';
        this.fireColor = '#bdfcd0';
        this.fireStrokeColor = '#cceffe';
        this.nolimit = false;
        this.limit = 200;
    };

    getBulletOption = (initX) => ({
        moveFun : Animation.wave(this.canvas.height, 12, 20, initX)
    });

    calPositionBullet = (bullet) => {
        bullet.y -= this.s;
        bullet.x = bullet.option.moveFun(bullet.y);
        bullet.outOfView = bullet.y - bullet.r <= 0;
    };
}