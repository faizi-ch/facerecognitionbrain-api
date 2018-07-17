
const handleSignUp = (req, res, db, bcrypt, app, bodyParser) => {
    app.use(bodyParser.json());
    const { name, email, password } = req.body;
    const saltRounds = 10;
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
}

module.exports = {
    handleSignUp: handleSignUp
}