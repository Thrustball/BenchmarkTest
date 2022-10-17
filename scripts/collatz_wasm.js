import init, { count_sequence } from "../wasm/collatz/collatz.js";

export function bench_wasm () {
    init("../wasm/collatz/collatz_bg.wasm")
        .then(() => {

            function bench_collatz_wasm(numberOfTests, iterations, p) {
                let completeTime = 0;
                let timePerOp = 0;
                let outputString = "";
                let detailedjson = {};
                for(let testRun = 0; testRun < numberOfTests; testRun++)
                {
                    let startTime = new Date().getTime();
            
                    for (let i = 0; i < iterations; i++) {
                        count_sequence(p);
                    }
            
                    let endTime = new Date().getTime();
                    let time = endTime - startTime;
                    let opTime = time / iterations;
                    timePerOp += opTime;
                    completeTime += time;
                    let curStr = `Run Number ${testRun}: time ${time}ms, op: ${opTime}ms`;
                    // console.info(curStr);
                    outputString+=curStr+"\n";
                    detailedjson[testRun]=time;
                }
                let average = completeTime / numberOfTests;
                let averageOpTime = timePerOp / numberOfTests;
                return {
                    average: average,
                    averageOpTime: averageOpTime,
                    detailedOutputString: outputString,
                    detailedjson: detailedjson,
                };
            }

            let iters = parseInt($("#iters").val());
            let runs = $("#runs").val();
            let para = $("#parameter").val();
        
            let result = bench_collatz_wasm(runs, iters, para);
            display_result(result, iters, runs, "WebAssembly");
            sendToServer("WebAssembly", result.detailedjson, runs, iters, result.average, para);
        }
        );
}
