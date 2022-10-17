import wasmInit from "/wasm/mandelbrot/mandelbrot.js";

export const bench_wasm = async () => {
    const rustWasm = await wasmInit("/wasm/mandelbrot/mandelbrot_bg.wasm");
    const image_size = 1000;

    // rustWasm.generate_mandelbrot(0,0,image_size);
    // drawArray();


    function drawArray() {

        const wasmByteMemoryArray = new Uint8Array(rustWasm.memory.buffer);
        const outputPointer = rustWasm.get_image_ptr();
        const imageDataArray = wasmByteMemoryArray.slice(
            outputPointer,
            outputPointer + image_size * image_size * 4
        );
        // console.log(imageDataArray);
        drawMandelbrotToCanvas(imageDataArray);
    }

    function bench_mandel_wasm(numberOfTests, iterations) {
        let completeTime = 0;
        let timePerOp = 0;        
        let outputString = "";
        let detailedjson = {};
        for(let testRun = 0; testRun < numberOfTests; testRun++)
        {
            let startTime = new Date().getTime();
    
            for (let i = 0; i < iterations; i++) {
                rustWasm.generate_mandelbrot(0,0,image_size);
            }
    
            let endTime = new Date().getTime();
            let time = endTime - startTime;
            let opTime = time / iterations;
            timePerOp += opTime;
            completeTime += time;
            let curStr = `Run Number ${testRun}: time ${time}ms, op: ${time / iterations}ms`;
            // console.info(curStr);
            outputString+=curStr+"\n";
            detailedjson[testRun]=time;
        }
        let average = completeTime / numberOfTests;
        let averageOpTime = timePerOp / numberOfTests;        
        drawArray();
        return {
            average: average,
            averageOpTime: averageOpTime,
            detailedOutputString: outputString,
            detailedjson: detailedjson,
        };
    }

    let iters = parseInt($("#iters").val());
    let runs = $("#runs").val();
    // let para = $("#parameter").val();

    let result = bench_mandel_wasm(runs, iters);
    display_result(result, iters, runs, "WebAssembly");
    sendToServer("WebAssembly", result.detailedjson, runs, iters, result.average, 1000);


};
