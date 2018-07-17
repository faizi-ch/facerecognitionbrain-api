const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
const signup = require('./controllers/signup');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

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

app.listen(3000, (req, res) => {
    console.log("running");
})

app.get('/', (req, res) => {
    //res.send("working");
})

app.post('/signin', (req, res) => signin.handleSignIn(req, res, db, bcrypt))

app.post('/signup', (req, res) => signup.handleSignUp(req, res, db, bcrypt, app, bodyParser));

app.get('/profile/:id', (req, res) => profile.handleProfileGet(req, res, db));

app.put('/image', (req, res) => image.handleImage(req, res, db));
app.post('/imageurl', (req, res) => image.handleApiCall(req, res));



/*

/ --> res = this is working
/signin --> POST = success/fail
/signup --> POST = user
/profile/:userId --> GET = user
/image --> PUT = user

*/