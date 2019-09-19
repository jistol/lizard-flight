class StrongBullet extends BasicBullet {
    constructor(canvas) {
        super(canvas);
        this.seq = 0;
        this.s = 5.5;
        this.r = 6;
        this.c = 80;
        this.damage = 75;
        this.collisionTime = 7;
        this.outOfView = false;
        this.bulletList = [];
        this.fireColor = '#fc8351';
        this.fireStrokeColor = '#fe5f0d';
        this.nolimit = false;
        this.limit = 10;
    };
}