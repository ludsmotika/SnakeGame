
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

//functions to read and write data into the database


// database.ref("gameScores").set({
//     bestScore: "1000"
// });

// To read data from the database:
// database.ref("gameScores").on("value", function (snapshot) {
//     var data = snapshot.val();
//     console.log(data);
// });


export async function getDanielScore() {
    database.ref("/gameScores").on("value", function (snapshot) {
        var data = snapshot.val();
        return data;
    });
}