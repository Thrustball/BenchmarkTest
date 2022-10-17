async function sendToServer() {
    const url = "/getValuesFromDb";
    
    let body = {};
    
    const options = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    fetch(url, options)
        .then(res => res.json())
        .then(vals => console.log(vals));

}

$("#testButton").click(() => {
    firstPlot();
});

$("#algoandbrowser").click(() => {
    secondPlot(); 
});
async function getAlgorithms() {
    const url = "/getAlgorithmsFromDb";
    
    let body = {};
    
    const options = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    fetch(url, options)
        .then(res => res.json())
        .then((vals) => {
            vals = vals.map((e) => e.algorithm);
            vals.sort();
            // console.log(vals);
            vals.forEach(element => {
                // let temp = element; //.algorithm;
                $("#algorithm").append(
                    `<option value="${element}">${element}</option>`
                );
            });
        });
}

async function getBrowsers() {
    const url = "/getBrowsersFromDb";
    
    let body = {};
    
    const options = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    fetch(url, options)
        .then(res => res.json())
        .then((vals) => {
            vals = vals.map((e) => e.browser);
            vals.sort();
            // console.log(vals);
            vals.forEach(element => {
                // let temp = element; //.algorithm;
                $("#browser").append(
                    `<option value="${element}">${element}</option>`
                );
            });
        });
}


async function getUsers() {
    const url = "/getUsersFromDb";
    
    let body = {};
    
    const options = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    fetch(url, options)
        .then(res => res.json())
        .then((vals) => {
            vals.forEach(element => {
                let u = element.uuid;
                let d = element.device;
                let b = element.browser;
                $("#user").append(
                    `<option value="${u}">${d}@${b}</option>`
                );
            });
        });
}

async function firstPlot() {
    const url = "/getFirstPlotData";
    let al = $("#algorithm").val();
    // console.log(al);
    
    let body = {
        algorithm: al,
    };
    
    const options = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    fetch(url, options)
        .then(res => res.json())
        .then((vals) => {
            // console.log(vals);
            let wasm_trace = {
                x: [al],
                y: [],
                name: 'WebAssembly',
                type: 'bar'
            };

            var js_trace = {
                x: [al],
                y: [],
                name: 'JavaScript',
                type: 'bar'
            };

            let y_js = [];
            let y_wasm = [];

            vals.forEach((ele) => {
                if(ele.language == "JavaScript") {
                    // js_trace.x.push(ele.algorithm);
                    // js_trace.y.push(ele.average / ele.iterations);
                    y_js.push(ele.average/ele.iterations);
                } else {
                    // wasm_trace.x.push(ele.algorithm);
                    // wasm_trace.y.push(ele.average / ele.iterations);
                    y_wasm.push(ele.average/ele.iterations);
                }
            });
            let js_y_val = y_js.reduce((akku, cur) => akku+cur, 0) / y_js.length;
            let wasm_y_val = y_wasm.reduce((akku, cur) => akku+cur, 0) / y_wasm.length;
            js_trace.y = [js_y_val];
            wasm_trace.y = [wasm_y_val];

            let data = [js_trace, wasm_trace];
            let layout = {barmode: 'group'};

            Plotly.newPlot('tester', data, layout);

        });


}

async function secondPlot() {
    const url = "/getAlgoandbrowser";
    let al = $("#algorithm").val();
    let br = $("#browser").val();
    // console.log(al);
    
    let body = {
        algorithm: al,
        browser: br,
    };
    
    const options = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    fetch(url, options)
        .then(res => res.json())
        .then((vals) => {
            // console.log(vals);
            let wasm_trace = {
                x: [al],
                y: [],
                name: 'WebAssembly',
                type: 'bar'
            };

            var js_trace = {
                x: [al],
                y: [],
                name: 'JavaScript',
                type: 'bar'
            };

            let y_js = [];
            let y_wasm = [];

            vals.forEach((ele) => {
                if(ele.language == "JavaScript") {
                    // js_trace.x.push(ele.algorithm);
                    // js_trace.y.push(ele.average / ele.iterations);
                    y_js.push(ele.average/ele.iterations);
                } else {
                    // wasm_trace.x.push(ele.algorithm);
                    // wasm_trace.y.push(ele.average / ele.iterations);
                    y_wasm.push(ele.average/ele.iterations);
                }
            });
            let js_y_val = y_js.reduce((akku, cur) => akku+cur, 0) / y_js.length;
            let wasm_y_val = y_wasm.reduce((akku, cur) => akku+cur, 0) / y_wasm.length;
            js_trace.y = [js_y_val];
            wasm_trace.y = [wasm_y_val];

            let data = [js_trace, wasm_trace];
            let layout = {barmode: 'group'};

            Plotly.newPlot('tester', data, layout);

        });


}

window.onload = () => {
    getUsers();
    getAlgorithms()
    getBrowsers();
};
