class Body {
    PI = 3.141592653589793;
    SOLAR_MASS = 4 * this.PI * this.PI;
    DAYS_PER_YEAR = 365.24;
    x = 0.0; y = 0.0; z = 0.0; vx = 0.0; vy = 0.0; vz = 0.0; mass = 0.0;
    constructor() {}


    jupiter(){
        let p = new Body();
        p.x = 4.84143144246472090e+00;
        p.y = -1.16032004402742839e+00;
        p.z = -1.03622044471123109e-01;
        p.vx = 1.66007664274403694e-03 * this.DAYS_PER_YEAR;
        p.vy = 7.69901118419740425e-03 * this.DAYS_PER_YEAR;
        p.vz = -6.90460016972063023e-05 * this.DAYS_PER_YEAR;
        p.mass = 9.54791938424326609e-04 * this.SOLAR_MASS;
        return p;
    }

    saturn(){
        let p = new Body();
        p.x = 8.34336671824457987e+00;
        p.y = 4.12479856412430479e+00;
        p.z = -4.03523417114321381e-01;
        p.vx = -2.76742510726862411e-03 * this.DAYS_PER_YEAR;
        p.vy = 4.99852801234917238e-03 * this.DAYS_PER_YEAR;
        p.vz = 2.30417297573763929e-05 * this.DAYS_PER_YEAR;
        p.mass = 2.85885980666130812e-04 * this.SOLAR_MASS;
    return p;
    }

    uranus(){
        let p = new Body();
        p.x = 1.28943695621391310e+01;
        p.y = -1.51111514016986312e+01;
        p.z = -2.23307578892655734e-01;
        p.vx = 2.96460137564761618e-03 * this.DAYS_PER_YEAR;
        p.vy = 2.37847173959480950e-03 * this.DAYS_PER_YEAR;
        p.vz = -2.96589568540237556e-05 * this.DAYS_PER_YEAR;
        p.mass = 4.36624404335156298e-05 * this.SOLAR_MASS;
    return p;
    }

    neptune(){
        let p = new Body();
        p.x = 1.53796971148509165e+01;
        p.y = -2.59193146099879641e+01;
        p.z = 1.79258772950371181e-01;
        p.vx = 2.68067772490389322e-03 * this.DAYS_PER_YEAR;
        p.vy = 1.62824170038242295e-03 * this.DAYS_PER_YEAR;
        p.vz = -9.51592254519715870e-05 * this.DAYS_PER_YEAR;
        p.mass = 5.15138902046611451e-05 * this.SOLAR_MASS;
    return p;
     }

    sun(){
        let p = new Body();
        p.mass = this.SOLAR_MASS;
        return p;
    }

    offsetMomentum(px, py, pz){
        this.vx = -px / this.SOLAR_MASS;
        this.vy = -py / this.SOLAR_MASS;
        this.vz = -pz / this. SOLAR_MASS;
        return this;
    }

}


class NBodySystem {
 
    constructor (){
        let body = new Body();
        this.bodies = new Array (
            body.sun(),
            body.jupiter(),
            body.saturn(),
            body.uranus(),
            body.neptune()
          );
 
       let px = 0.0;
       let py = 0.0;
       let pz = 0.0;
       for(let i=0; i < this.bodies.length; ++i) {
          px += this.bodies[i].vx * this.bodies[i].mass;
          py += this.bodies[i].vy * this.bodies[i].mass;
          pz += this.bodies[i].vz * this.bodies[i].mass;
       }
       this.bodies[0].offsetMomentum(px,py,pz);
    }
 
    advance(dt) {
       for(let i=0; i < this.bodies.length; ++i) {
          let iBody = this.bodies[i];
          for(let j=i+1; j < this.bodies.length; ++j) {
            let dx = iBody.x - this.bodies[j].x;
            let dy = iBody.y - this.bodies[j].y;
            let dz = iBody.z - this.bodies[j].z;
 
            let dSquared = dx * dx + dy * dy + dz * dz;
            let distance = Math.sqrt(dSquared);
            let mag = dt / (dSquared * distance);
 
             iBody.vx -= dx * this.bodies[j].mass * mag;
             iBody.vy -= dy * this.bodies[j].mass * mag;
             iBody.vz -= dz * this.bodies[j].mass * mag;
 
             this.bodies[j].vx += dx * iBody.mass * mag;
             this.bodies[j].vy += dy * iBody.mass * mag;
             this.bodies[j].vz += dz * iBody.mass * mag;
          }
       }

       this.bodies.forEach((body) => {
        body.x += dt * body.vx;
        body.y += dt * body.vy;
        body.z += dt * body.vz;
       });
    }
 
    energy(){
       let dx=0.0, dy=0.0, dz=0.0, distance=0.0;
       let e = 0.0;
 
       for (let i=0; i < this.bodies.length; ++i) {
          let iBody = this.bodies[i];
          e += 0.5 * iBody.mass *
             ( iBody.vx * iBody.vx
                 + iBody.vy * iBody.vy
                 + iBody.vz * iBody.vz );
 
          for (let j=i+1; j < this.bodies.length; ++j) {
             let jBody = this.bodies[j];
             dx = iBody.x - jBody.x;
             dy = iBody.y - jBody.y;
             dz = iBody.z - jBody.z;
 
             distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
             e -= (iBody.mass * jBody.mass) / distance;
          }
       }
       return e;
    }
 }

 function nbody_advance(n = 1000) {

    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 9,
    });

    let bodies = new NBodySystem();
    let e1 = formatter.format(bodies.energy());
    for(let i = 0; i < n; i++) {
         bodies.advance(0.01);
    }
 
    let e2 = formatter.format(bodies.energy());

    return [e1, e2];
 }

function bench_js() {
    let iters = parseInt($("#iters").val());
    let runs = $("#runs").val();
    let para = $("#inp").val();

    let result = bench_collatz_js(runs, iters, para);
    display_result(result, iters, runs, "JavaScript");
    sendToServer("JavaScript", result.detailedjson, runs, iters, result.average, para);

    return;

}

function bench_collatz_js(numberOfTests, iterations, p) {
    let completeTime = 0;
    let outputString = "";
    let detailedjson = {};
    let res;
    for(let testRun = 0; testRun < numberOfTests; testRun++)
    {
        let startTime = new Date().getTime();

        for (let i = 0; i < iterations; i++) {
            res = nbody_advance(p);
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

    $("#e1").text("Enegery before: ").append(res[0]);
    $("#e2").text("Enegery after: ").append(res[1]);


    return {
        average: average,
        detailedOutputString: outputString,
        detailedjson: detailedjson,

    };
}

function display_result(r, iterations, runs, lang) {
    let time = r.average;
    let outputString = r.detailedOutputString;
    $("#results").html(`<h3>The Benchmark was done in ${lang}</h3>`);
    $("#results").append(`<br>Average Time needed for ${iterations.toExponential()} iterations = ${time}ms`);
    $("#results").append(`<br>${runs} Testruns were performed.`);
    $("#results").append(`<br>${outputString.replace(/\n/ig, "<br>")}`);
}

async function sendToServer(lang, times, runs, iterations, average, parameter) {
    const url = "/valuesInDB";
    
    let body = {
        uuid: getCookie('uuid'),
        lang: lang,
        algo: 'nbody',
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