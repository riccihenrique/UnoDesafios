const express = require('express');
const pg = require('pg');
const parser = require('body-parser');

const app = express();
app.use(parser.urlencoded({extended:true}));
//const strCon = "postgres://mxyyzybl:qCNIIgJiY6qwEg0kZ-SARWv5BdpueQKU@rajje.db.elephantsql.com:5432/mxyyzybl";
const strCon = "postgres://pzuxtdyftdnblj:3e15c181b02e1612fa3bb3ee622e0a4a27d7af867ba3ad8504d2e4c7c8e8d1c7@ec2-34-193-42-173.compute-1.amazonaws.com:5432/d6m6vhr2q7p6mc";

var client;

app.get('/gerar', (req, res) => {
    client = new pg.Client(strCon);
    client.connect().then().catch(err => console.log(err));
    client.query("select * from desafio d inner join categoria c on d.cat_cod = c.cat_cod order by RANDOM () LIMIT 1", (err, query) => {
        if(err)
            client.end().then().catch(err => console.log(err));
        
        if(query) {
            query.rows.forEach(row => {
                res.send(row.des_desc + " ou compre " + row.cat_qtde + " cartas");
            });
            client.end().then().catch(err => console.log(err));
        }
    });
});

app.get('/', (req, res) => res.sendFile(__dirname + '/home.html'));

app.get('/cad', (req, res) => res.sendFile(__dirname + '/cad.html'));

app.get('/cat', (req, res) => {    
    client = new pg.Client(strCon);
    client.connect().then().catch(err => console.log(err));
    client.query("select * from categoria", (err, query) => {
        let str = "";
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

app.get('/desafios', (req, res) => {
    client = new pg.Client(strCon);
    client.connect().then().catch(err => console.log(err));
    client.query("select * from desafio", (err, query) => {
        let str = "";
        if(err)
           str = "err";        
        if(query) {
            query.rows.forEach(row => {                
                str += "<div class=\"desafios\"><span class=\"des\">Desafio: " + row.des_desc + "</span><br><span onclick=\"excluiDes(" + row.des_cod + ")\" class=\"cat\">Categoria: " + row.cat_cod + "</span></div>"; 
            })
        }
        client.end().then().catch(err => console.log(err));
        res.send(str);
    });
});

app.post("/excluides", (req, res) => {
    client = new pg.Client(strCon);
    client.connect().then().catch(err => console.log(err));
    client.query("delete from desafio where des_cod = " + req.body.cod, (err, query) => {
        var str = "";
        if(err)
           str = "err";        
        if(query) 
            str = "ok";
        client.end().then().catch(err => console.log(err));
        res.send(str);
    });
});

app.listen(process.env.PORT || 5000);
  