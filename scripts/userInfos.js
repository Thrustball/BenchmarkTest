async function getHash(val) {

    let url = "/getHash"

    let body = {
        val: val,
    };

    const options = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    let ans = await fetch(url, options)
        .then(res => res.text());

    // console.log(ans);
    return ans;
}

function sendData() {
    let wsh = window.screen.height;
    let wsw = window.screen.width;
    // console.log(`${wsh} ${wsw}`);

    let wsah = window.screen.availHeight;
    let wsaw = window.screen.availWidth
    // console.log(`${wsah} ${wsaw}`);

    let device = $("#device").val();
    let os = $("#os").val();
    let osv = $("#os-v").val();
    let browser = $("#browser").val();
    let cpu = $("#cpu").val();
    let ram = $("#ram").val();
    let gpu = $("#gpu").val();

    let currentTime = (new Date()).getTime();

    let hashString = device+os+osv+browser+cpu+ram+gpu+wsh+wsw+wsah+wsaw+currentTime;

    const url = "/gui";

    getHash(hashString).then((hash) => {
        let body = {
            wsh: wsh,
            wsw: wsw,
            wsah: wsah,
            wsaw: wsaw,
            device: device,
            os: os,
            osv: osv,
            browser: browser,
            cpu: cpu,
            ram: ram,
            gpu: gpu,
            hash: hash,
        };

        const options = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        };

        // console.log(body);
        if(getCookie('uuid') == '') { 
        setCookie('uuid', hash, 365);
        // console.log(hash);

        let baseURL = /http.*\//i.exec(window.location.href)[0];
        let site = $("#benchmark").val();

        // console.log(body);
        fetch(url, options)
            .then(_ => window.location.href = `${baseURL}${site}`);
        }
    });



    // console.log(body);

    // fetch(url, options)
    //     .then(res => res.text())
    //     .then(site => window.location.href = `http://localhost:3000/${site}`);
}

function gotoBench() {
    let baseURL = /http.*\//i.exec(window.location.href)[0];
    let site = $("#benchmark").val();
    window.location.href = `${baseURL}${site}`;
}

function checkAvailableButton() {
    if (getCookie('uuid') == "") {
        // $("#gotoBench").prop("disabled", "true");
        $('#gotoBench').hide();
    } else {
        // $("#submit").prop("disabled", "true");
        $('.inp').hide();
        $('br').hide();
    }
}

$(document).ready(() => {
    checkAvailableButton();
});