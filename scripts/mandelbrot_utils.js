function drawMandelbrotToCanvas(array) {

    const canvasElement = document.getElementById("drawing_area");

    const canvasContext = canvasElement.getContext("2d");
    const canvasImageData = canvasContext.createImageData(
        canvasElement.width,
        canvasElement.height
    );



    canvasContext.clearRect(0,0,canvasElement.width, canvasElement.height);

    canvasImageData.data.set(array);
    canvasContext.clearRect(0,0,canvasElement.width, canvasElement.height);
    canvasContext.putImageData(canvasImageData, 0, 0);
}

async function sendToServer(lang, times, runs, iterations, average, parameter) {
    const url = "/valuesInDB";
    
    let body = {
        uuid: getCookie('uuid'),
        lang: lang,
        algo: 'mandelbrot',
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
    let timePerOp = (r.averageOpTime);//.toFixed(2);
    $("#results").html(`<h3>The Benchmark was done in ${lang}</h3>`);
    $("#results").append(`<br>Average Time needed for ${iterations.toExponential()} iterations = ${time}ms`);
    $("#results").append(`<br>Average Time per operation ${timePerOp}ms`);    
    $("#results").append(`<br>${runs} Testruns were performed.`);
    $("#results").append(`<br>${outputString.replace(/\n/ig, "<br>")}`);
}

