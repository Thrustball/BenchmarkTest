export class Mandelbrot_js {
    constructor (IMAGE_SIZE) {
        this.IMAGE_SIZE = IMAGE_SIZE;
        this.X_MIN = -2.00;
        this.X_MAX =  0.47;
        this.Y_MIN = -1.12;
        this.Y_MAX =  1.12;
        this.MAX_ITERATIONS = 450;
        this.OUTPUT_BUFFER = new Uint8Array(this.IMAGE_SIZE*this.IMAGE_SIZE*4);
    }

    generate_mandelbrot(show_x, show_y, square_size) {
        let show_x_min = map_range(show_x, 0.0, this.IMAGE_SIZE, this.X_MIN, this.X_MAX);
        let show_y_min = map_range(show_y, 0.0, this.IMAGE_SIZE, this.Y_MIN, this.Y_MAX);
        let show_x_max = map_range(show_x + square_size, 0.0, this.IMAGE_SIZE, this.X_MIN, this.X_MAX);
        let show_y_max = map_range(show_y + square_size, 0.0, this.IMAGE_SIZE, this.Y_MIN, this.Y_MAX);

        for(let py = 0; py < this.IMAGE_SIZE; py++) {
            for(let px = 0; px < this.IMAGE_SIZE; px++) {
                let x = 0.0;
                let y = 0.0;

                let x0 = map_range(px, 0.0, this.IMAGE_SIZE, show_x_min, show_x_max);
                let y0 = map_range(py, 0.0, this.IMAGE_SIZE, show_y_min, show_y_max);
                
                let iteration = 0;
                let x2 = 0.0;
                let y2 = 0.0;

                while (x2 + y2 <= 4.0 && iteration < this.MAX_ITERATIONS) {
                    y = 2.0 * x * y + y0;
                    x = x2 - y2 + x0;
                    x2 = x * x;
                    y2 = y * y;
                    iteration++;
                }

                let colour = map_range(iteration, 0.0, this.MAX_ITERATIONS, 0.0, 255.0);
                let index = (py * this.IMAGE_SIZE + px) * 4;

                this.OUTPUT_BUFFER[index]   = colour;
                this.OUTPUT_BUFFER[index+1] = colour;
                this.OUTPUT_BUFFER[index+2] = colour;
                this.OUTPUT_BUFFER[index+3] = 255;
                
            }
        }
    }
} 

function map_range(input, input_start, input_end, output_start, output_end) {
    let slope = (output_end - output_start) / (input_end - input_start);
    let output = output_start + slope * (input - input_start);
    return output;
}

export function bench_js() {
    let iters = parseInt($("#iters").val());
    let runs = $("#runs").val();
    // let para = $("#parameter").val();

    let result = bench_mandelbrot_js(runs, iters);
    display_result(result, iters, runs, "JavaScript");
    // console.log(result.detailedjson);
    sendToServer("JavaScript", result.detailedjson, runs, iters, result.average, 1000);

    return;
}

function bench_mandelbrot_js(numberOfTests, iterations) {
    let completeTime = 0;
    let completeOpTime = 0;
    let outputString = "";
    let detailedjson = {};
    let m = new Mandelbrot_js(1000);
    for(let testRun = 0; testRun < numberOfTests; testRun++)
    {
        let startTime = new Date().getTime();

        for (let i = 0; i < iterations; i++) {
            m.generate_mandelbrot(0,0,1000);
        }

        let endTime = new Date().getTime();
        let time = endTime - startTime;
        let opTime = time / iterations;
        completeOpTime += opTime;
        completeTime += time;
        let curStr = `Run Number ${testRun}: time ${time}ms, op: ${time / iterations}ms`;
        // console.info(curStr);
        outputString+=curStr+"\n";
        detailedjson[testRun]=time;
    }
    let ob = m.OUTPUT_BUFFER;
    drawMandelbrotToCanvas(ob);
    let average = completeTime / numberOfTests;
    let averageOpTime = completeOpTime / numberOfTests;
    return {
        average: average,
        averageOpTime: averageOpTime,
        detailedOutputString: outputString,
        detailedjson: detailedjson,

    };
}
