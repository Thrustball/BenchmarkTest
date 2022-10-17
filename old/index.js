const express = require('express');
const response = require('express');
const csv = require('csv-parser');
const ObjectsToCsv = require('objects-to-csv');
const fs = require('fs');


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
    res.sendFile(__dirname + '/index.html');
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



app.post('/set_values', (req, res) => {
    let this_response = {
        type: req.body.type,
        count: req.body.count
    };

    let file = './database/t_clothes.csv';

    // console.log(req.body);

    // console.log(JSON.stringify(response));

    let results = [];

    fs.createReadStream('./database/t_clothes.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            let currentDate = new Date();
            let cDay = currentDate.getDate();
            let cMonth = currentDate.getMonth() + 1;
            let cYear = currentDate.getFullYear();
            let date = cYear + "-" + cMonth + "-" + cDay;
            let time = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
            let timestamp = date + " " + time;

            results.push({'type': this_response.type, 'count': this_response.count, 'timestamp': timestamp});

            (async () => {
                const csv = new ObjectsToCsv(results);
                
                // Save to file:
                await csv.toDisk('./database/t_clothes.csv');
                res.end(`${this_response.type} has beed updated to ${this_response.count}!`);
                
                // Return the CSV file as string:
                // console.log(await csv.toString());
                })();
        });



    // var db = new sqlite.Database(file);

    // db.run(`INSERT INTO t_clothes VALUES(?, ?, datetime('now'))`, [response.type, response.count], function(err) {
    //     if (err) {
    //     //   return console.log(err.message);
    //     res.end(err);
    //     }
    //     // get the last insert id
    //     console.log(`A row has been inserted with rowid ${this.lastID}`);
    //   });
    // res.end(`${response.type} has beed updated to ${response.count}!`);
    // db.close();
});

app.post('/set_values', (req, res) => {
    response = {
        type: req.body.type,
        count: req.body.count
    };

    let file = './database/clothes.db';

    // console.log(req.body);

    // console.log(JSON.stringify(response));

    var db = new sqlite.Database(file);

    db.run(`INSERT INTO t_clothes VALUES(?, ?, datetime('now'))`, [response.type, response.count], function(err) {
        if (err) {
        //   return console.log(err.message);
        res.end(err);
        }
        // get the last insert id
        console.log(`A row has been inserted with rowid ${this.lastID}`);
      });
    res.end(`${response.type} has beed updated to ${response.count}!`);
    db.close();
});

app.get('/collatz', (req, res) => {
    res.sendFile(__dirname + '/html/wasm.html');
});

app.get('/process_post', (req, res) => {
    res.sendFile(__dirname + '/html/process_post.html');
});

app.post('/process_post', (req, res) => {
    response = {
        first_name: req.body.first_name,
        last_name: req.body.last_name
    };
    console.log(response);
    res.end(JSON.stringify(response));
})

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/html/chat.html');
});

// TODO: Test getting message -> Write to console
// app.post('/message')

app.listen(port, () => {
    console.log('App listening on port ' + port);
});
