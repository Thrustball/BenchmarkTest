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

function benchmarktest1(iterations = 100000, numberOfTests = 1, fun) {
    let completeTime = 0;
    let outputString = "";
    for(let testRun = 0; testRun < numberOfTests; testRun++)
    {
        let startTime = new Date().getTime();

        for (let i = 0; i < iterations; i++) {
            fun();
        }

        let endTime = new Date().getTime();
        let time = endTime - startTime;
        completeTime += time;
        let curStr = `Run Number ${testRun}: time ${time}ms, op: ${time / iterations}ms`;
        console.info(curStr);
        outputString+=curStr+"\n";
    }
    let average = completeTime / numberOfTests;
    return {
        average: average,
        detailedOutput: outputString,

    };
}



function run() {
    let testFunction = () => {
        countSequence(9);
    };
    let iterations = parseInt($("#iters").val());
    let runs = $("#runs").val();
    console.log(iterations);
    let result = benchmarktest1(iterations, runs, testFunction);
    let time = result.average;
    let outputString = result.detailedOutput;
    $("#results").text(`Average Time needed for ${iterations.toExponential()} iterations = ${time}ms`);
    $("#results").append(`<br>${runs} Testruns were performed.`);
    $("#results").append(`<br>${outputString.replace(/\n/ig, "<br>")}`);
}

let workerRunning = false;
let worker = null;

function runWorker() {
    let testFunction = () => {
        countSequence(9);
    };
    let iterations = parseInt($("#iters").val());
    let runs = $("#runs").val();
    // console.log(iterations);
    
    if(!workerRunning) {
        if(worker === null) worker = new Worker("./scripts/bench.js");
        
        workerRunning = true;
        showLoadingSymbol();
        worker.postMessage([iterations, runs]);
    }
    // let result = benchmarktest1(iterations, runs, testFunction);
    worker.onmessage = (result) => {
        let time = result.data[0];
        let outputString = result.data[1];
        $("#results").text(`Average Time needed for ${iterations.toExponential()} iterations = ${time}ms`);
        $("#results").append(`<br>${runs} Testruns were performed.`);
        $("#results").append(`<br>${outputString.replace(/\n/ig, "<br>")}`);
        workerRunning = false;   
        showLoadingSymbol(); 
    };


}

function showLoadingSymbol() {
    if(workerRunning) {
        $("#startButton").hide();
        $("#loading").show();
    } else {
        $("#loading").hide();
        $("#startButton").show();
    }
}