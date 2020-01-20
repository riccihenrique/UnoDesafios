const express = require('express');
var pg = require('pg');

const app = express();
const strCon = "postgres://mxyyzybl:qCNIIgJiY6qwEg0kZ-SARWv5BdpueQKU@rajje.db.elephantsql.com:5432/mxyyzybl";

var client = new pg.Client(strCon);

app.get('/gerar', (req, res) => {
    client.connect(err => console.log("Erro: " + err));
    client.query("select * from desafio d inner join categoria c on d.cat_cod = c.cat_cod order by RANDOM () LIMIT 1", (err, query) => {
        if(err)
            console.log(err);
        
        if(query) {
            query.rows.forEach(row => {
                res.send(row.des_desc + " ou compre " + row.cat_qtd + " cartas");
            });
        }
    });
    client.end();
});

app.get('/', (req, res) => {    
    res.sendFile(__dirname + '/home.html');
});

app.listen(process.env.PORT || 5000);
  