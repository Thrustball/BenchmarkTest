const express = require('express');
const response = require('express');
const csv = require('csv-parser');
const ObjectsToCsv = require('objects-to-csv');
const fs = require('fs');
const crypto = require('crypto');


const app = express();
const port = 3000;

var bodyParser = require('body-parser');  
// var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

const sqlite = require('sqlite3');


app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/libaries', express.static(__dirname + '/libaries'));
app.use('/images', express.static(__dirname + '/images'));
app.use('/stylesheets', express.static(__dirname + '/stylesheets'));
app.use('/wasm', express.static(__dirname + '/wasm'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/html/landing.html');
});

app.get('/sudoku', (req, res) => {
    res.sendFile(__dirname + '/html/sudoku.html');
});

app.get('/nqueens', (req, res) => {
    res.sendFile(__dirname + '/html/nqueens.html');
});

app.get('/ft', (req, res) => {
    res.sendFile(__dirname + '/html/functionsTest.html');
});

app.get('/collatz', (req, res) => {
    res.sendFile(__dirname + '/html/collatz.html');
});

app.get('/fannkuch', (req, res) => {
    res.sendFile(__dirname + "/html/fannkuch.html");
});

app.get('/cellauto', (req, res) => {
    res.sendFile(__dirname + "/html/cellauto.html");
});

app.get('/nbody', (req, res) => {
    res.sendFile(__dirname + "/html/nbody.html");
});

app.get('/mandelbrot', (req, res) => {
    res.sendFile(__dirname + "/html/mandelbrot.html");
});

app.get('/explore', (req, res) => {
    res.sendFile(__dirname + "/html/data_explorer.html");
});

app.post('/getHash', (req, res) => {
    let val = req.body.val;
    var hash = crypto.createHash('sha256')
        .update(val)
        .digest('hex');
    res.send(hash);
    res.end();
});

app.post('/gui', (req, res) => {
    let database_file = "./database/users.db";

    var db = new sqlite.Database(database_file);

    console.log(req.body)

    let os = (req.body.os).toLowerCase();
    let browser = (req.body.browser).toLowerCase();
    let device = (req.body.device).toLowerCase();

    db.run(`INSERT INTO userInformation VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, 
        [req.header('host'), req.header('user-agent'), JSON.stringify(req.headers),
            req.body.wsw, req.body.wsh, req.body.wsaw, req.body.wsah,
            device, os, req.body.osv, browser,
            req.body.cpu, req.body.ram, req.body.gpu, req.body.hash], 
            function(err) {
            if (err) {
            //   return console.log(err.message);
            res.end(err);
            }
            // get the last insert id
            res.end("collatz");
            console.log(`A row has been inserted with rowid ${this.lastID}`);
      });
      db.close();


});

app.post('/getValuesFromDb', (req, res) => {
    let database_file = "./database/users.db";
    var db = new sqlite.Database(database_file);

    db.all(`SELECT * FROM benchmarkTimes
    where algorithm = "collatz";`, (err, row) => {
        res.json(row);
    });
    db.close();
    // res.end();
});

app.post('/getAlgorithmsFromDb', (req, res) => {
    let database_file = "./database/users.db";
    var db = new sqlite.Database(database_file);

    db.all(`SELECT DISTINCT algorithm FROM benchmarkTimes;`, (err, row) => {
        res.json(row);
    });
    db.close();
    // res.end();
});

app.post('/getUsersFromDb', (req, res) => {
    let database_file = "./database/users.db";
    var db = new sqlite.Database(database_file);

    db.all(`SELECT DISTINCT uuid, device, browser FROM userInformation;`, 
    (err, row) => {
        res.json(row);
    });
    db.close();
    // res.end();
});

app.post('/getBrowsersFromDb', (req, res) => {
    let database_file = "./database/users.db";
    var db = new sqlite.Database(database_file);

    db.all(`SELECT DISTINCT browser FROM userInformation;`, 
    (err, row) => {
        res.json(row);
    });
    db.close();
    // res.end();
});

app.post('/getFirstPlotData', (req, res) => {
    let database_file = "./database/users.db";
    var db = new sqlite.Database(database_file);

    let algorithm = req.body.algorithm;

    db.all(`SELECT average, algorithm, language, iterations 
            FROM benchmarkTimes 
            WHERE algorithm = "${algorithm}";`,
    (err, row) => {
        // console.log(row);
        res.json(row);
    });
    db.close();
    // res.end();
});

app.post('/getAlgoandbrowser', (req, res) => {
    let database_file = "./database/users.db";
    var db = new sqlite.Database(database_file);

    let algorithm = req.body.algorithm;
    let browser = req.body.browser;

    db.all(`SELECT average, algorithm, language, iterations 
            FROM benchmarkTimes 
            WHERE algorithm = "${algorithm}"
            AND uuid in (
              SELECT uuid FROM userInformation
              WHERE browser="${browser}");`,
    (err, row) => {
        // console.log(row);
        res.json(row);
    });
    db.close();
    // res.end();
});


app.post('/valuesInDB', (req, res) => {

    let database_file = "./database/users.db";

    var db = new sqlite.Database(database_file);

    // console.log(req.body)

    let dateTime = new Date().toISOString();

    db.run(`INSERT INTO benchmarkTimes VALUES(?,?,?,?,?,?,?,?,?)`, 
        [ req.body.uuid, req.body.lang, req.body.algo, 
            req.body.times, req.body.runs, req.body.iters, 
            dateTime, req.body.average, req.body.parameter ],
            function(err) {
            if (err) {
            console.log(err.message);
            res.end(err);
            }
            // get the last insert id
            res.end();
            console.log(`A row has been inserted with rowid ${this.lastID}`);
      });
      db.close();


});

app.get('/get_values_db', (req, res) => {
    let file = './database/clothes.db';

    var db = new sqlite.Database(file);

    let sql_query = `select d.type, d.count, d.timestamp 
    from t_clothes d
    where timestamp = (select max(d1.timestamp) 
                         from t_clothes d1 
                         where d1.type = d.type
                        ) ORDER BY d.type;`;

    db.all(sql_query, function(err, rows) {
        res.json(rows);
	});	

    db.close();

    // res.json(clothes);

});

function uniquep(o, t) {
    for (let i in o) {
        if(o[i].type == t) return false;
    }
    return true;
}

function get_unqiue(re) {
    let unique = [];
    // console.log(re);

    for (let o in re) {
        let t = re[o].type;
        let c = re[o].count;
        // console.log(c);

        if (uniquep(unique, t)) {
            unique.push({'type': t, 'count': c});
            // console.log(c);
        }
    }
    // console.log(unique);
    return unique;
}

app.get('/get_values', (req, res) => {

    let results = [];

    fs.createReadStream('./database/t_clothes.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            let r = get_unqiue(results.reverse());
            res.json(r);
        });

});

app.listen(port, () => {
    console.log('App listening on port ' + port);
});
