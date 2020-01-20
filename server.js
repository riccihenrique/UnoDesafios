const express = require('express');
const pg = require('pg');
const parser = require('body-parser');

const app = express();
app.use(parser.urlencoded({extended:true}));
const strCon = "postgres://mxyyzybl:qCNIIgJiY6qwEg0kZ-SARWv5BdpueQKU@rajje.db.elephantsql.com:5432/mxyyzybl";

var client;

app.get('/gerar', (req, res) => {
    client = new pg.Client(strCon);
    client.connect().then().catch(err => console.log(err));
    client.query("select * from desafio d inner join categoria c on d.cat_cod = c.cat_cod order by RANDOM () LIMIT 1", (err, query) => {
        if(err)
            client.end().then().catch(err => console.log(err));
        
        if(query) {
            query.rows.forEach(row => {
                res.send(row.des_desc + " ou compre " + row.cat_qtd + " cartas");
            });
            client.end().then().catch(err => console.log(err));
        }
    });
});

app.get('/', (req, res) => res.sendFile(__dirname + '/home.html'));

app.get('/cad', (req, res) => res.sendFile(__dirname + '/cad.html'));

app.get('/cat', (req, res) => {
    var str = "";
    client = new pg.Client(strCon);
    client.connect().then().catch(err => console.log(err));
    client.query("select * from categoria", (err, query) => {
        if(err)
            client.end().then().catch(err => console.log(err));        
        if(query) {
            query.rows.forEach(row => {
                str += "<option value=\"" + row.cat_cod + "\">" + row.cat_desc + "</option>";
            });
            client.end().then().catch(err => console.log(err));
            res.send(str);
        }
    });
});

app.post('/gravar', (req, res) => {    
    client = new pg.Client(strCon);
    client.connect().then().catch(err => console.log(err));
    client.query("insert into desafio (des_desc, cat_cod) values($1, $2)", [req.body.desc, req.body.cat], (err, query) => {
        var str = "";
        if(err)
           str = "err";        
        if(query) 
            str = "ok";
        client.end().then().catch(err => console.log(err));
        res.send(str);
    });
});

function getCat(cod) {
    client = new pg.Client(strCon);
    client.connect().then().catch(err => console.log(err));
    client.query("select * from categoria where cat_cod = " + cod, (err, query) => {
        if(err)
        {
            console.log(err);
            client.end().then().catch(err => console.log(err));
        }        
        if(query) {
            client.end().then().catch(err => console.log(err));
            return query.rows[0];
        }
    });
}

app.get('/desafios', (req, res) => {
    client = new pg.Client(strCon);
    client.connect().then().catch(err => console.log(err));
    client.query("select * from desafio", (err, query) => {
        var str = "";
        if(err)
           str = "err";        
        if(query) {
            query.rows.forEach(row => {                
                str += "<span> Desafio: " + row.des_desc + " Categoria: " + row.cat_cod + "</span><br>"; 
            })
        }
        client.end().then().catch(err => console.log(err));
        res.send(str);
    });
})

app.listen(process.env.PORT || 5000);
  