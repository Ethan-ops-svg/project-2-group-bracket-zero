class ship {
    constructor () {
        this.hbox = 26;
        this.up = false;
        this.spinning = false;

        this.physics;
        this.sprite_sheet;
        this.load_sheet();

        this.spriteW = 100;
        this.spriteH = 100;

        this.frameX;
        this.frameY;
        this.current_frame = 0;
        this.rot = 0;
        this.total_frames = 3;

    }
    async load_sheet() {
        /*
        loads sprite png
        */
        this.sprite_sheet = await loadImage("lydiaCode/ship.png");
    }
    draw (x, y, mult) {
        /*
        draws current frame of ship to screen
        args:
            x: x coord on screen
            y: y coord on screen
            mult: scale factor

        returns: none
        */
       let currentFrameImg;
        if (this.spinning) {
            currentFrameImg = this.spin();
        } else {
            currentFrameImg = this.get_frame();
        }
        if(currentFrameImg) {
            image(currentFrameImg, x, y, this.spriteW*mult, this.spriteH*mult)
        }
        
    }
    get_frame() {
        /*
        gets the desired ship frame based on active inputs
        args: none
        returns:
            P5 image object to draw to screen
        */
        if (this.spinning || !this.sprite_sheet) {
            return;
        }
        if (keyIsDown('a')) {
        this.frameX = 2*this.spriteW;

        } else if (keyIsDown('d')) {
        this.frameX = 0;

        } else {
        this.frameX = this.spriteW;

        }

        if (this.up) {
        this.frameY = 0;
        } else {
        this.frameY = 2*this.spriteH;
        }

        return this.sprite_sheet.get(this.frameX, this.frameY, this.spriteW, this.spriteH);

    }
    spin() {
        /*
        plays ship spin animation
        args: none
        returns:
            p5 image object to draw to screen
        */
        if (!this.sprite_sheet) {
            return;
        }
        this.frameY = this.spriteH;
        if(frameCount % 3 == 0) {
            if (this.current_frame == this.total_frames) {
                this.current_frame = 0;
                this.rot ++;
            } else {
                this.current_frame ++;
            }
        }

        if (this.rot < 2) { // rotates only twice
            let frame = this.sprite_sheet.get(this.current_frame * this.spriteW, this.frameY, this.spriteW, this.spriteH);
            return frame;
        } else {
            this.spinning = false;
        }
    }
}