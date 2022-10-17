import init, { run } from "../wasm/nbody/nbody.js";

export function bench_wasm () {
    init("../wasm/nbody/nbody_bg.wasm")
        .then(() => {

            function bench_collatz_wasm(numberOfTests, iterations, p) {
                let completeTime = 0;
                let outputString = "";
                let detailedjson = {};
                let res = [];
                for(let testRun = 0; testRun < numberOfTests; testRun++)
                {
                    let startTime = new Date().getTime();
            
                    for (let i = 0; i < iterations; i++) {
                        res = run(p);
                    }
            
                    let endTime = new Date().getTime();
                    let time = endTime - startTime;
                    completeTime += time;
                    let curStr = `Run Number ${testRun}: time ${time}ms, op: ${time / iterations}ms`;
                    // console.info(curStr);
                    outputString+=curStr+"\n";
                    detailedjson[testRun]=time;
                }
                let average = completeTime / numberOfTests;

                const formatter = new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 9,
                });

                $("#e1").text("Enegery before: ").append(formatter.format(res[0]));
                $("#e2").text("Enegery after: ").append(formatter.format(res[1]));
            
                return {
                    average: average,
                    detailedOutputString: outputString,
                    detailedjson: detailedjson,
                };
            }

            let iters = parseInt($("#iters").val());
            let runs = $("#runs").val();
            let para = $("#inp").val();
        
            let result = bench_collatz_wasm(runs, iters, para);
            display_result(result, iters, runs, "WebAssembly");
            sendToServer("WebAssembly", result.detailedjson, runs, iters, result.average, para);
        }
        );
}