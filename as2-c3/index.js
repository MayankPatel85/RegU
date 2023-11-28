const express = require("express");
const { Firestore, Timestamp } = require("@google-cloud/firestore");
const cors = require("cors");

const app = express();
const firestore = new Firestore();

/**
 * Setting cross origin
 */
app.use(express.json(), cors({
    origin: ""
}));

app.get('/', function (req, res) {
    res.send('App started.');
});

// get all online users
app.get('/users', async function (req, res) {
    const onlineUsers = await getOnlineUsers();
    res.json({
        users: onlineUsers
    });
});

// logout request
app.post('/logout', async function (req, res) {
    const email = req.body.email;
    const name = req.body.name;
    await updateStatus(email, name);
    res.json({
        logout: "Successfull"
    });
});

/**
 * Finds all documents where the state is online
 * and store it in an array
 * @returns array of user documents
 */
async function getOnlineUsers() {
    const stateCollection = "state";
    var users = [];

    const stateRef = firestore.collection(stateCollection);
    const onlineUsers = await stateRef.where("state", "==", "online").get();
    if(!onlineUsers.empty) {
        onlineUsers.forEach((doc) => {
            users.push(doc.data());
        });
    }
    return users;
}

/**
 * Finds document with same email and name and
 * updates the state of user in state collection to offline
 * and timestamp to current timestamp
 * @param {string} email 
 * @param {string} name 
 */
async function updateStatus(email, name) {
    const stateCollection = "state";

    const stateRef = firestore.collection(stateCollection);
    const userState = await stateRef.where("Email", "==", email).where("Name", "==", name).get();
    const userDocId = userState.docs[0].id;
    await stateRef.doc(userDocId).update({
        state: "offline",
        timeStamp: Timestamp.now()
    });
}

app.listen(8000);

module.exports = app;