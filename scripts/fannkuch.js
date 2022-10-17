function appendToEveryPos(l, e) {
    let result = [];

    for(let i = 0; i < l.length; i++) {
        let temp = [...l];
        temp.splice(i,0,e);
        result.push(temp);
    }

    l.push(e);
    result.push(l);

    return result;
}

function permutations_recursive(l) {

    let result = [];
    
    if (l.length == 2) {
        return [[l[0], l[1]],[l[1], l[0]]];
    }

    let ele = l.pop();
    let ret = permutations_recursive(l);

    for(let i = 0; i < ret.length; i++) {
        let temp = appendToEveryPos(ret[i], ele);
        result = result.concat(temp);
    }

    return result;

}

function fak(n) {
    let result = 1;
    for(let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Permutations class partially copied from:
// https://benchmarksgame-team.pages.debian.net/benchmarksgame/program/fannkuchredux-gpp-5.html

class Permutations {
    constructor (n, start) {
        this.count = [];
        this.current = [];
        this.cur_idx = 1;
        this.max = fak(n);

        this.n = n;

        // initialize count
        for (let i = n-1; i>=0; --i) {
            let d = start / fak(i);
            start = start % fak(i);
            this.count[i] = d;
        }

        //initialize current
        for (let i = 1; i <= n; ++i) {
            this.current[i-1] = i;
        }

    }

    advance() {
        if(this.cur_idx >= this.max) return;
        for (let i = 1; ;++i) {
            let first = this.current[0];
            for (let j = 0; j < i; ++j) {
                this.current[j] = this.current[j + 1];
            }
            this.current[i] = first;
            ++(this.count[i]);
            if (this.count[i] <= i) break;
            this.count[i] = 0;
        }
        this.cur_idx++;
    }

}

function generate_permutations(n) {
    let p = new Permutations(n, 0);
    let max = fak(n);
    let result = [];

    for (let i = 0; i < max-1; i++) {
        result.push([...p.current]);
        p.advance();
    }
    result.push([...p.current]);

    return result;

}

function flip(l) {
    let flips = 0;
    // let len = l.length;
    while(l[0] != 1) {
        let first = l[0];
        let rev_part = l.slice(0,first).reverse();
        let last_part = l.slice(first);
        l = rev_part.concat(last_part);
        flips++;
    }
    return flips;
}

function fannkuch_js(n) {
    let checksum = 0;
    let max = 0;

    let max_iter = fak(n);
    let p = new Permutations(n, 0);
    let ele = [...p.current];
    for(let i = 0; i<max_iter; i++) {
        let flips = flip(ele);
        if(i % 2 == 0) {
            checksum += flips;
        } else {
            checksum = checksum - flips;
        }
        if (flips > max) max = flips;
        p.advance();
        ele = [...p.current];
    }

    return {
        max: max,
        checksum: checksum,
    };
}

function bench_fannkuch_js(numberOfTests, iterations, p) {
    let completeTime = 0;
    let timePerOp = 0;    
    let outputString = "";
    let detailedjson = {};
    for(let testRun = 0; testRun < numberOfTests; testRun++)
    {
        let startTime = new Date().getTime();

        for (let i = 0; i < iterations; i++) {
            fannkuch_js(p);
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

function bench_js() {
    let iters = parseInt($("#iters").val());
    let runs = $("#runs").val();
    let para = $("#inp").val();

    let result = bench_fannkuch_js(runs, iters, para);
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
        algo: 'fannkuch',
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

function display_result(r, iterations, runs, lang) {
    let time = r.average;
    let outputString = r.detailedOutputString;
    let timePerOp = r.averageOpTime;
    $("#results").html(`<h3>The Benchmark was done in ${lang}</h3>`);
    $("#results").append(`<br>Average Time needed for ${iterations.toExponential()} iterations = ${time}ms`);
    $("#results").append(`<br>Average Time per operation ${timePerOp}ms`);
    $("#results").append(`<br>${runs} Testruns were performed.`);
    $("#results").append(`<br>${outputString.replace(/\n/ig, "<br>")}`);
}
