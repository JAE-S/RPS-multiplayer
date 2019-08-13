/*
========================================
RPS - Multiplayer Game 
========================================
*/

/*
========================================
Firebase configuration
========================================
*/
var config = {
    apiKey: "AIzaSyDjD6f9WuqO9tlDUrU_Pb_HwMvFOGrOE2M",
    authDomain: "rps-multiplayer-e6ab6.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-e6ab6.firebaseio.com",
    storageBucket: "",
    messagingSenderId: "1062565958363",
  };

firebase.initializeApp(config);   

/*
========================================
GLOBAL VARIABLES 
========================================
*/

var database = firebase.database();
var players = database.ref('players');
var playerCount = database.ref('playerCount');
var outcome = database.ref('gameResults');

var player = {

    name: "",
    choice: "",
    wins: 0,
    losses: 0,
    uid: ""
};

var player_1 = null;
var player_2 = null;
var totalPlayers = null;
var nextPlayer = "";

var gameResults = "";
$('.choice-1').hide();
$('.choice-2').hide();

$(document).ready(function() {

/*
========================================
Start Game
========================================
*/

 /*
========================================
Hide instructions screen 
========================================
*/

// $('#instructions').hide();

/*
========================================
Add New Players
========================================
*/

function newPlayers() {
    firebase.auth().signInAnonymously();
    var playerName = $('#userName').val().trim();
    player.name = playerName;
    player.uid = firebase.auth().currentUser.uid;

    database.ref().once('value').then(function(snapshot) {

        if (!snapshot.child('players/1').exists()) {       // If a snapsot of player 1 does not exist.. do the following
            database.ref('players/1/').update(player);    // Updates player 1's details in firebase
            var player_1_details = $('#player-1');       // Adds Player 1's name 
            var player_2_details;                       // Prevents duplicate player
            player_1_details.html(playerName + ' ');
            player_1_details.append('Wins: ' + player.wins);
            player_1_details.append('Losses: ' + player.losses);
            player_1 = 1;
            player_2 = 2; 
            nameField.hide();                     // Hides name feild on click 
            addPlayerButton.hide();              // Hides name feild on click 
            
            playerCount.once('value').then(function(snapshot) { // Snapshot of database for player count
                totalPlayers = snapshot.val();
                if (totalPlayers === null) {
                    totalPlayers = 1;
                    playerCount.set(totalPlayers);
                } else {
                    totalPlayers++;
                    playerCount.set(totalPlayers);
                }
            });

        } else if (!snapshot.child('players/2').exists()) {

            database.ref('players/2/').update(player);
            var player_1_details = $('#player-2');
            var player_2_details;
            player_1_details.html(playerName + ' ');
            player_1_details.append('Wins: ' + player.wins);
            player_1_details.append('Losses: ' + player.losses);
            player_1 = 2;
            player_2 = 1
            nameField.hide();
            addPlayerButton.hide();
            
            playerCount.once('value').then(function(snapshot) { // Snapshot of database for player count
                totalPlayers = snapshot.val();
                if (totalPlayers === null) {
                    totalPlayers = 1;
                    playerCount.set(totalPlayers);
                } else {
                    totalPlayers++;
                    playerCount.set(totalPlayers);
                }
            });

        } else {
            alert('This game is currently full. Please try again later.');
        }

    });
}
newPlayers()

/*
========================================
Game rules 
========================================
*/

/*
========================================
Outcome
========================================
*/

/*
========================================
Chat
========================================
*/

})