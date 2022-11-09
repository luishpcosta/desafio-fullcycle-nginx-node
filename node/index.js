const express = require('express')
const app = express()
const port = 3000

const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'appdb'
};

const mysql = require('mysql')
const conn = mysql.createConnection(config)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

app.get('/', async(req, res) => {
    try {
        await insertEntry('Luis Henrique');
        const listaUsersFormated = formatListHtml(await getEntry());
        res.send('<h1>Full Cycle Rocks!</h1><h4>Lista de nomes cadastrado no banco de dados:</h4>' + listaUsersFormated)
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
})


async function insertEntry(name){
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO people (name) VALUES (?)', [name], (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result.insertId);
        });
    });
};

async function getEntry() {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM people ORDER BY id ASC`,  (error, elements) => {
            if (error) {
                return reject(error);
            }
            return resolve(elements);
        });
    });
};

function formatListHtml(elements){
    let listaUsers = '';

    for (let i = 0; i < elements.length ; i++) {
        listaUsers+='<p><b>User:</b> ' + elements[i].name + ' - <b>Id:</b> ' + elements[i].id + '</p>';
    }

    return listaUsers
}