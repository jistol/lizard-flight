class FastBullet extends BasicBullet {
    constructor(canvas) {
        super(canvas);
        this.seq = 0;
        this.s = 7.5;
        this.r = 6;
        this.damage = 50;
        this.collisionTime = 5;
        this.outOfView = false;
        this.bulletList = [];
        this.fireUnit = 5;
        this.iconTxt = 'F';
        this.fireColor = '#9802fc';
        this.fireStrokeColor = '#610bfe';
        this.nolimit = false;
        this.limit = 180;

        this.rotateTerm = 3;
    };

    set fireTerm(term) {};

    get fireTerm() {
        this.rotateTerm--;
        if (this.rotateTerm <= 0) {
            this.rotateTerm = 3;
            return 15;
        }
        return 5;
    };
}