class PlayField {
    constructor(size) {
        this.size = size;
        this.yval = [];
        for(let i = 0; i < size; i++) {
            this.yval.push(-1);
        }
    }

    check_possible(index, y_pos) {

        // already taken
        if(this.yval[index] != -1) {return false;}


        // check diagonal
        for(let i = 0; i < index; i++) {
            let diff = index - i;
            let curval = this.yval[i];

            if(y_pos == curval) {return false;}

            let lower = y_pos - diff;
            let upper = y_pos + diff;

            if(lower == curval || upper == curval) {return false;}
        }
        return true;
    }

    set_value(index, value) {
        this.yval[index] = value;
    }

    get_value(index) {
        return this.yval[index];
    }

    fully_set() {
        for(let i = 0; i < this.size; i++) {
            if (this.yval[i] == -1) {return false;}
        }
        return true;
    }

}

function nqueens(pf) {
    let solved = false;
    let index = 0;
    let max_number = pf.size;
    let last_index = [];
    for(let i = 0; i < max_number; i++) {
        last_index.push(0);
    }

    outer:
    while(!solved) {
        if(pf.fully_set()) {break outer;}

        for(let n = last_index[index]; n < max_number; n++) {
            if(pf.check_possible(index, n)) {
                pf.set_value(index, n);
                last_index[index] = n + 1;
                index++;
                continue outer;
            }
        }

        if (index != 0) {
            last_index[index] = 0;
            index -= 1;
        } else {
            return [-1];
        }

        pf.set_value(index, -1);
    }

    return pf;
}

function solve_nqueens_js(size) {
    let pf = new PlayField(size);
    return nqueens(pf).yval;
}

function bench_nqueens_js(numberOfTests, iterations, p) {
    let completeTime = 0;
    let timePerOp = 0;
    let outputString = "";
    let detailedjson = {};
    for(let testRun = 0; testRun < numberOfTests; testRun++)
    {
        let startTime = new Date().getTime();

        for (let i = 0; i < iterations; i++) {
            solve_nqueens_js(p);
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
    let sol = solve_nqueens_js(p);
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

function display_result(r, iterations, runs, lang) {
    let time = r.average;
    let outputString = r.detailedOutput;
    let timePerOp = (r.averageOpTime*1000000).toFixed(2);
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
    let para = $("#noq").val();

    let result = bench_nqueens_js(runs, iters, para);
    display_result(result, iters, runs, "JavaScript");
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
        algo: 'nqueens',
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
