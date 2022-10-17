class Mandelbrot {
    constructor (canvasName, canvasWidth, canvasHeight, maxIterations) {
        this.canvasName = canvasName;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.maxIterations = maxIterations;

        this.xMin  = -2.00;
        this.xMax  =  0.47;
        this.yMin  = -1.12;
        this.yMax  =  1.12;
        this.xStep =  2.47 / canvasWidth;
        this.yStep =  2.24 / canvasHeight;

        this.pixelArray = new Array(canvasHeight*canvasWidth*4).fill(0);
    }

    init() {
        $(`#${this.canvasName}`).attr("width", this.canvasWidth);
        $(`#${this.canvasName}`).attr("height", this.canvasHeight);

        let canvas = document.getElementById(`${this.canvasName}`);
        let ctx = canvas.getContext('2d');

        let maxIter = this.pixelArray.length / 4;
        for(let i = 1; i < maxIter / 4; i++) {
            this.pixelArray[4*i-1] = 255;
        }

        ctx.putImageData(this.pixelArray, 0, 0);
    }

    // returns greyscaled-image in range 0 - 1
    iterateScreenPixel (px, py) {
        let x0 = this.xMin + (this.xStep * px);
        let y0 = this.yMin + (this.yStep * py);
        let x = 0.0;
        let y = 0.0;
        let iteration = 0;
        while(x*x + y*y <= 4 && iteration < this.maxIterations) {
            let xTemp = x*x - y*y + x0;
            y = 2*x*y + y0;
            x = xTemp;
            iteration++;
        }
        return (iteration / this.maxIterations);
    }

    fillPixelArray () {
        for(let y = 0; y < this.canvasHeight; y++) {
            for(let x = 0; x < this.canvasWidth; x++) {
                let id = y * this.canvasWidth + x;
                let val = this.iterateScreenPixel(x,y);
                this.pixelArray[id] = val;
            }
        }
    }
}

export { Mandelbrot };