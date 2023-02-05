
const firebaseConfig = {
    apiKey: "AIzaSyCM44tCddNZq_-UcJqCpSh0P5E4sEZYXUo",
    authDomain: "snake-game-db.firebaseapp.com",
    databaseURL: "https://snake-game-db-default-rtdb.firebaseio.com",
    projectId: "snake-game-db",
    storageBucket: "snake-game-db.appspot.com",
    messagingSenderId: "192216304601",
    appId: "1:192216304601:web:1ef0f315e815e4776f27c8",
    measurementId: "G-CXQP89FVF8"
};



firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var ref = database.ref("/gameScores");

//functions to read and write data into the database

export async function getTopScores() {

    let data;

    await ref.once("value").then((snapshot) => {
        data = snapshot.val();
    });

    return data;
}


export async function checkForNewBestScore(score) {
    let scores = await getTopScores();

    const scoresArray = [...Object.entries(scores)];

    let index = scoresArray.findIndex(x => x[1].score < score);

    if (index != -1) {
        //we found new best score
        return true;
    }

    return false;
}

export async function setNewBestRecord(name, score) {

    //logic for removing the worst score
    let scores = await getTopScores();
    const scoresArray = [...Object.entries(scores)];

    let indexOfMinScore = -1;
    let minScore = 8000;

    let count = 0;
    for (const current of scoresArray) {
        if (current[1].score <= minScore) {
            minScore = current[1].score;
            indexOfMinScore = count;
        }
        count++;
    }

    database.ref(`/gameScores/${scoresArray[indexOfMinScore][0]}`).remove();

    var data = {
        name,
        score
    }

    var newData = ref.push();
    newData.set(data);
}


export async function doesNameExist(name) {
    let scores = await getTopScores();

    const scoresArray = [...Object.entries(scores)];

    for (const current of scoresArray) {
        if (current[1].name == name) {
            return true;
        }
    }

    return false;
}