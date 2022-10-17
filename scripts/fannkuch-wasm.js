import init, { fannkuch_wasm } from "../wasm/fannkuch/fannkuch.js";

export function simple_run(n) {
    init("../wasm/fannkuch/fannkuch_bg.wasm")
        .then(() => {
            let res = fannkuch_wasm(n);
            $("#return-max").append(res[1]);
            $("#return-checksum").append(res[0]);
        });
}

export function bench_wasm () {
    init("../wasm/fannkuch/fannkuch_bg.wasm")
        .then(() => {

            function bench_fannkuch_wasm(numberOfTests, iterations, p) {
                let completeTime = 0;
                let timePerOp = 0;
                let outputString = "";
                let detailedjson = {};
                for(let testRun = 0; testRun < numberOfTests; testRun++)
                {
                    let startTime = new Date().getTime();
            
                    for (let i = 0; i < iterations; i++) {
                        fannkuch_wasm(p);
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
                return {
                    average: average,
                    averageOpTime: averageOpTime,
                    detailedOutputString: outputString,
                    detailedjson: detailedjson,
                };
            }

            let iters = parseInt($("#iters").val());
            let runs = $("#runs").val();
            let para = $("#inp").val();
        
            let result = bench_fannkuch_wasm(runs, iters, para);
            display_result(result, iters, runs, "WebAssembly");
            sendToServer("WebAssembly", result.detailedjson, runs, iters, result.average, para);
        }
        );
}
