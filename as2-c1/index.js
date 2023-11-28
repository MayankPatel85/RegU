const express = require("express");
const { Firestore } = require("@google-cloud/firestore");
const cors = require("cors");

const app = express();
const firestore = new Firestore();

const port = process.env.PORT || 8080;

/**
 * setting cross origin
 */
app.use(express.json(), cors({
    origin: ""
}));

app.get('/', function (req, res) {
    res.send('App started.');
});

app.post('/register', async function (req, res) {
    const user = {
        Name: req.body.name,
        Email: req.body.email,
        Password: req.body.password,
        Location: req.body.location
    };
    await registerUser(user);
    res.send("User registered successfully.");
});

/**
 * Adds user document is Reg collection
 * @param {object} user
 * 
 */
async function registerUser(user) {
    const regCollection = "Reg";
    const regRef = firestore.collection(regCollection);
    await regRef.add(user);
}

app.listen(port);

module.exports = app;