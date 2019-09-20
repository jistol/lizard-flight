class FastBullet extends BasicBullet {
    constructor(canvas) {
        super(canvas);
        this.seq = 0;
        this.s = 5.5;
        this.r = 6;
        this.fireTerm = 10;
        this.damage = 55;
        this.collisionTime = 5;
        this.outOfView = false;
        this.bulletList = [];
        this.iconTxt = 'F';
        this.fireColor = '#16edfc';
        this.fireStrokeColor = '#cceffe';
        this.nolimit = false;
        this.limit = 100;
    };
}