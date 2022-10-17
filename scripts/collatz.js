function nextCollatz(n) {
    if (n % 2 == 0) return n/2;
    else return 3 * n + 1;
}

function countSequence(start) {
    let count = 0;
    while (start > 1) {
        count++;
        start = nextCollatz(start);
    }
    return count;
}

function bench_collatz_js(numberOfTests, iterations, p) {
    let completeTime = 0;
    let timePerOp = 0;
    let outputString = "";
    let detailedjson = {};
    for(let testRun = 0; testRun < numberOfTests; testRun++)
    {
        let startTime = new Date().getTime();

        for (let i = 0; i < iterations; i++) {
            countSequence(p);
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

function display_result(r, iterations, runs, lang) {
    let time = r.average;
    let outputString = r.detailedOutputString;
    let timePerOp = (r.averageOpTime*1000000).toFixed(2);
    // let timePerOp = r.averageOpTime;
    $("#results").html(`<h3>The Benchmark was done in ${lang}</h3>`);
    $("#results").append(`<br>Average Time needed for ${iterations.toExponential()} iterations = ${time}ms`);
    $("#results").append(`<br>Average Time per operation ${timePerOp}ns`);
    $("#results").append(`<br>${runs} Testruns were performed.`);
    $("#results").append(`<br>${outputString.replace(/\n/ig, "<br>")}`);
}

let running = false;

function showLoadingSymbol() {
    if(running) {
        $("#startButton").hide();
        // $("#loading").show();
    } else {
        // $("#loading").hide();
        $("#startButton").show();
    }
}

function bench_js() {
    let iters = parseInt($("#iters").val());
    let runs = $("#runs").val();
    let para = $("#parameter").val();

    let result = bench_collatz_js(runs, iters, para);
    display_result(result, iters, runs, "JavaScript");
    // console.log(result.detailedjson);
    sendToServer("JavaScript", result.detailedjson, runs, iters, result.average, para);

    return;
    
    // result.then(res => {
    //     display_result(res, iters, runs);
    // })
    // display_result(result, iters, runs);
}

async function sendToServer(lang, times, runs, iterations, average, parameter) {
    const url = "/valuesInDB";
    
    let body = {
        uuid: getCookie('uuid'),
        lang: lang,
        algo: 'collatz',
        times: JSON.stringify(times),
        runs: runs,
        iters: iterations,
        average: average,
        parameter: parameter,
    };
    
    const options = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    await fetch(url, options);

}
