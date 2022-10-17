import init, { solve_nqueens } from "../wasm/nqueens/acht_damen.js";

// init("../wasm/nqueens/acht_damen_bg.wasm")
//     .then(() => {
//         let startTime = new Date().getTime();
//         let solution = solve_nqueens(size);
//         let endTime = new Date().getTime();

//         console.log(endTime - startTime);

//         solution.forEach((el) => {
//             $("#result").append(`${el} `);
//         });
//     });

    export function bench_wasm () {
        init("../wasm/nqueens/acht_damen_bg.wasm")
            .then(() => {
    
                function bench_nqueens_wasm(numberOfTests, iterations, p) {
                    let completeTime = 0;
                    let timePerOp = 0;
                    let outputString = "";
                    let detailedjson = {};
                    for(let testRun = 0; testRun < numberOfTests; testRun++)
                    {
                        let startTime = new Date().getTime();
                
                        for (let i = 0; i < iterations; i++) {
                            solve_nqueens(p);
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

                    let sol = solve_nqueens(p);
                    $("#solution").text("");
                    sol.forEach((el) => {
                        $("#solution").append(`${el} `);
                    });

                    let average = completeTime / numberOfTests;
                    let averageOpTime = timePerOp / numberOfTests;
                    return {
                        average: average,
                        averageOpTime: averageOpTime,
                        detailedOutput: outputString,
                        detailedjson: detailedjson,
                
                    };
                }
    
                let iters = parseInt($("#iters").val());
                let runs = $("#runs").val();
                let para = $("#noq").val();
            
                let result = bench_nqueens_wasm(runs, iters, para);
                display_result(result, iters, runs, "WebAssembly");
                sendToServer("WebAssembly", result.detailedjson, runs, iters, result.average, para);
            }
            );
    }
