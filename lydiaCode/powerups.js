class powerup {
    constructor (isUp = false) {
        this.physics;
        this.up = isUp;
        this.sprite_sheet;
        this.frames = [];
        this.load_sheet();

        this.hbox = 17; // radius of hitbox
        this.spriteW = 50;
        this.spriteH = 50;

        this.frameX;
        this.frameY;
        this.current_frame = 0;
        this.total_frames = 4;
    }
    async load_sheet() {
        /*
        loads sprite png
        */
        loadImage(
            "lydiaCode/powerup.png",
            (img) => {
                this.sprite_sheet = img;
                const gl = drawingContext;
                for (let col = 0; col < 4; col++) {
                    const frame = img.get(col * this.spriteW, 0, this.spriteW, this.spriteH);
                    this.frames[col] = frame;
                }
            },
            (err) => {
                console.error("Failed to load poewrup sprite:", err);
            }
        );
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
        if (this.frames.length !== 4) {
            return;
        }
        if(frameCount % 4 == 0) {
            if (this.current_frame === this.total_frames - 1) {
                this.current_frame = 0;
            } else {
                this.current_frame ++;
            }
        }
        return this.frames[this.current_frame];
    }
}