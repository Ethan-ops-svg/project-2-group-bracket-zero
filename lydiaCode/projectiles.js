class projectile {
    constructor (isUp = false) { // should be called with ship's up value and not change
        this.physics;
        this.up = isUp;
        this.sprite_sheet;
        this.load_sheet();

        this.hbox = 10; // radius of hitbox
        this.spriteW = 25;
        this.spriteH = 25;

        this.frameX;
        this.frameY;
        this.current_frame = 0;
        this.total_frames = 1;
    }
    async load_sheet() {
        /*
        loads sprite png
        */
        this.sprite_sheet = await loadImage("lydiaCode/projectile.png");
    }
    draw (x, y, mult) {
        /*
        draws current frame to screen
        args:
            x: x coord on screen
            y: y coord on screen
            mult: scale factor
            
        returns: none
        */
        let currentFrameImg = this.get_frame()
        if (currentFrameImg) {
            image(currentFrameImg, x, y, this.spriteW*mult, this.spriteH*mult)
        }
    }
    get_frame() {
        /*
        gets the desired frame
        args: none
        returns:
            P5 image object to draw to screen
        */
        if (!this.sprite_sheet) {
            return;
        }
        this.frameY = 0;
        this.frameX = this.current_frame * this.spriteW;
        if(frameCount % 4 == 0) {
            if (this.current_frame == this.total_frames) {
                this.current_frame = 0;
            } else {
                this.current_frame ++;
            }
        }

        let frame = this.sprite_sheet.get(this.frameX, this.frameY, this.spriteW, this.spriteH);
        return frame;
        
    }
}