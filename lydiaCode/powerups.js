class powerup {
    constructor (fileName, isUp = false) {
        this.physics;
        this.up = isUp;
        this.sprite_sheet;
        this.fileName = fileName;
        this.load_sheet();
    }
    async load_sheet() {
        /*
        loads sprite png
        */
        this.sprite_sheet = await loadImage("lydiaCode/" + this.fileName);
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

class asteroid extends enemy {
    constructor (isUp) {
        super('powerup.png', isUp);

        this.hbox = 26; // radius of hitbox
        this.spriteW = 100;
        this.spriteH = 100;

        this.frameX;
        this.frameY;
        this.current_frame = 0;
        this.total_frames = 6;
        
    }
}