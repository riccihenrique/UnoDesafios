const express = require('express');
const app = express();
const fs = require('fs');
var path = require('path');


app.get('/', (req, res) => {
    
    res.render('/home');
});

app.get('/gerar', (req, res) => {

    fs.readFile('desafios.txt', function(err,data){
        if(err) {
            console.error("Could not open file: %s", err);
            process.exit(1);
        }
        
        var a = data.toString('utf8').split('\n');
        const i = Math.floor(Math.random() * a.length);
        res.send(a[i] + " ou compre " + (Math.floor(Math.random() * 9) + 6) + " cartas");
    });
});

app.listen(3001, function () {
    console.log('Fala corno!');
  });
  