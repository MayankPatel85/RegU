const express = require("express");
const { Firestore, Timestamp } = require("@google-cloud/firestore");
const cors = require("cors");

const app = express();
const firestore = new Firestore();

const port = process.env.PORT || 8000;

app.use(express.json());

/**
 * Setting cross origin
 */
app.use(cors({
    origin: ""
}));

app.get('/', function (req, res) {
    res.send('App started.');
});

app.post('/login', async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const regUser = await authenticateUser(email, password);
    // if the email and password do not exist in collection
    // then return authentication failed
    if (regUser.empty) {
        res.json({
            login: "Authentication failed."
        });
    } else {
        const regUserData = regUser.docs[0].data();
        // updating the state to online in state collection
        await updateStatus(regUserData);
        res.json({
            login: "Successfull",
            Name: regUserData.Name,
            Email: regUserData.Email
        })
    }
});

/**
 * authenticate user by checking if the entry exists
 * in Reg collection or not
 * @param {string} email 
 * @param {string} password 
 * @returns firestore query snapshot
 */
async function authenticateUser(email, password) {
    const regCollection = "Reg";

    const regRef = firestore.collection(regCollection);
    const regUser = await regRef.where("Email", "==", email).where("Password", "==", password).get();
    return regUser;
}

/**
 * Checks if document with same email and name exists in state collection
 * if exists it update the state to online and timestamp to current timestamp
 * if doc does not exist then it creates new doc in state collection
 * @param {object} user 
 */
async function updateStatus(user) {
    const stateCollection = "state";

    const stateRef = firestore.collection(stateCollection);
    const userState = await stateRef.where("Email", "==", user.Email).where("Name", "==", user.Name).get();
    if(userState.empty) {
        await stateRef.add({
            Email: user.Email,
            Name: user.Name,
            state: "online",
            timeStamp: Timestamp.now()
        });
    } else {
        const userDoc = userState.docs[0].id;
        await stateRef.doc(userDoc).set({
            state: "online",
            timeStamp: Timestamp.now()
        })
    }
}

app.listen(port);

module.exports = app;

// https://cloud.google.com/firestore/docs/manage-data/add-data#node.js
// https://cloud.google.com/firestore/docs/query-data/get-data
// https://cloud.google.com/firestore/docs/query-data/get-data#node.js
// https://cloud.google.com/firestore/docs/create-database-server-client-library#firestore_setup_dataset_pt1-nodejs
// https://cloud.google.com/iam/docs/attach-service-accounts#attaching-to-resources