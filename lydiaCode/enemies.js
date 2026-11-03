class enemy {
    constructor (fileName, isUp = false) {
        this.physics;
        this.up = isUp;
        this.sprite_sheet;
        this.fileName = fileName;
        this.frames = [];
        this.load_sheet();
        
    }
    async load_sheet() {
        /*
        loads sprite png
        */
        loadImage(
            "lydiaCode/" + this.fileName,
            (img) => {
                this.sprite_sheet = img;
                const gl = drawingContext;
                for (let col = 0; col < 8; col++) {
                    const frame = img.get(col * this.spriteW, 0, this.spriteW, this.spriteH);
                    this.frames[col] = frame;
                }
            },
            (err) => {
                console.error("Failed to load enemy sprite:", err);
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
        if (mult > 0.1) {
            this.hbox = 26;
        }
        let currentFrameImg = this.get_frame();
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
        if (this.frames.length !== 8) {
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

class asteroid extends enemy {
    constructor (isUp) {
        super('asteroid.png', isUp);

        this.hbox = 0; // radius of hitbox
        this.spriteW = 100;
        this.spriteH = 100;

        this.frameX;
        this.frameY;
        this.current_frame = 0;
        this.total_frames = 8;
    }
}