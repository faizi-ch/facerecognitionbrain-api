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

db.select().table('users').then(d => console.log(d)
);

const app = express();

app.use(bodyParser.json());
app.use(cors());

const saltRounds = 10;

const database = {
    users: [
        {
            id: '23',
            name: 'Reeda',
            email: 'reeda.saeed@gmail.com',
            password: 'faizi',
            entries: 0,
            joined: new Date()
        },
        {
            id: '44',
            name: 'Faizan',
            email: 'faizi.ch@live.com',
            password: '444',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.listen(3000, (req, res) => {
    console.log("running");
    //console.log(database.users);
})

app.get('/', (req, res) => {
    //res.send("working");
    res.send(database.users);
})

app.post('/signin', (req, res) => {

    // Load hash from your password DB.
    bcrypt.compare(req.body.password, "$2b$10$ofH9dfbIY5BlOmT5KfA68.X1C5lIQeXL/S6cB9QtNTitUl/u/WhZa", function (err, res) {
        // res == true
        console.log(res);

    });
    bcrypt.compare(req.body.password, "$2b$10$Z/PEI2EGxc4xqV3.yapKpOT8xs8KKNYK3qarVnQY38cvLLVnYoq.a", function (err, res) {
        // res == false
        console.log(res);

    });

    if (req.body.email == database.users[1].email && req.body.password == database.users[1].password)
        //res.json("success...signing in");
        res.json(database.users[1]);
    else
        res.status(400).json('error signing in');
})

app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    bcrypt.hash(password, saltRounds, function (err, hash) {
        // Store hash in your password DB.
        console.log(hash);

    });

    db('users').insert({
        email: email,
        name: name,
        joined: new Date()
    })
        .returning('*')
        .then(user => {
            res.json(user[0]);
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