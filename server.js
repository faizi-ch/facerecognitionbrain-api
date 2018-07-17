const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
var knex = require('knex');


const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: '4444',
        database: 'face-recognition-brain'
    }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

const saltRounds = 10;

app.listen(3000, (req, res) => {
    console.log("running");
})

app.get('/', (req, res) => {
    //res.send("working");
})

app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);

            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => res.json(user[0]))
                    .catch(err => res.status(400).json('Unable to get user!'));
            }
            else {
                res.status(400).json('Wrong credentials!');
            }
        })
        .catch(err => res.status(400).json('Wrong credentials!'));
})

app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    const hash = bcrypt.hashSync(password, saltRounds);
    // Storing hash in password DB.
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return db('users').insert({
                    email: loginEmail[0],
                    name: name,
                    joined: new Date()
                })
                    .returning('*')
                    .then(user => {
                        res.json(user[0]);
                    })
                    .catch(err => res.status(400).json('User already exists!'));
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(err => res.status(400).json('User already exists!'));
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;

    db.select('*').from('users').where({ id })
        .then(user => {
            if (user.length)
                res.json(user[0]);
            else
                res.status(400).json('User not found!');
        })
        .catch(err => res.status(400).json('Error getting user!'));
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => res.json(entries[0]))
        .catch(err => res.status(404).json('Error!'));
})



/*

/ --> res = this is working
/signin --> POST = success/fail
/signup --> POST = user
/profile/:userId --> GET = user
/image --> PUT = user

*/