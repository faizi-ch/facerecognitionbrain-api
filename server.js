const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');

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

    database.users.push({
        id: '45',
        name: name,
        email: email,
        entries: 0,
        joined: new Date()
    })

    res.json(database.users[database.users.length - 1]);
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }

    })
    if (!found) {
        res.status(404).json('no such user');
    }
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }

    })
    if (!found) {
        res.status(404).json('no such user');
    }
})



/*

/ --> res = this is working
/signin --> POST = success/fail
/signup --> POST = user
/profile/:userId --> GET = user
/image --> PUT = user

*/