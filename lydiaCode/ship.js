class ship {
    constructor () {
        this.hbox = 26;
        this.up = false;
        this.spinning = false;

        this.physics;
        this.sprite_sheet;

        this.spriteW = 100;
        this.spriteH = 100;

        this.frameX;
        this.frameY;
        this.current_frame = 0;
        this.rot = 0;
        this.total_frames = 4;
        this.frames = [];

        this.load_sheet();

    }
    async load_sheet() {
        /*
        loads sprite png
        */
        // this.sprite_sheet = await loadImage("lydiaCode/ship.png");

        loadImage(
            "lydiaCode/ship.png",
            (img) => {
                console.log("Sprite sheet loaded:", img.width, img.height);

                this.sprite_sheet = img;
                const gl = drawingContext;

                for (let row = 0; row < 3; row++) {
                    this.frames[row] = [];

                    for (let col = 0; col < 4; col++) {
                        const frame = img.get(col * this.spriteW, row * this.spriteH, this.spriteW, this.spriteH);
                        this.frames[row][col] = frame;
                    }
                }
            },
            (err) => {
                console.error("Failed to load ship sprite:", err);
            }
        );
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
        if (this.spinning || this.frames.length !== 3) {
            return;
        }

        let col;
        let row;

        if (this.physics.input.left) {
        col = 2;

        } else if (this.physics.input.right) {
        col = 0;

        } else {
        col = 1;

        }

        if (this.up) {
        row = 0;
        } else {
        row = 2;
        }

        return this.frames[row][col];

    }
    spin() {
        /*
        plays ship spin animation
        args: none
        returns:
            p5 image object to draw to screen
        */
        if (this.frames.length !== 3) {
            return;
        }

        this.frameY = this.spriteH;
        if(frameCount % 3 === 0) {
            if (this.current_frame == this.total_frames - 1) {
                this.current_frame = 0;
                this.rot ++;
            } else {
                this.current_frame ++;
            }
        }

        if (this.rot < 2) { // rotates only twice
            return this.frames[1][this.current_frame];
        } else {
            this.spinning = false;
        }
    }
}