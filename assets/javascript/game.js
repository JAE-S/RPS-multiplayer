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
var players = database.ref('players');          // Connects players details to the database
var playerCount = database.ref('playerCount'); // Keeps track of the number of players in the database
var outcome = database.ref('gameResults');    // Connects outcomes to the database

var player = {                  // Stores player details
    name: "",
    choice: "",
    wins: 0,
    losses: 0,
    uid: ""
};

var player_1 = null;                // Sets up player 1
var player_2 = null;                // Sets up player 2
var totalPlayers = null;            // Sets up total number of players
var nextPlayer = "";                // Stores next player's details
var gameResults = "";               // Stores game results 

/*
========================================
Hidden Elements
========================================
*/

$('.choice-1').hide();              // Initially hides player 1's choice on 
$('.choice-2').hide();              // Initially hides player 2's choice 
// $('#instructions').hide();

$(document).ready(function() {

/*
========================================
Start Game
========================================
*/

$('#start').on('click', newPlayers);
var nameField = $('#userName');             // Hides name feild on click 
var addPlayerButton = $('#start');         // Stoes new play 
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
        firebase.auth().signInAnonymously();              // Firebase initial authentication sign in 
        var playerName = $('#userName').val().trim();     // Stores unserName input as playerName 
        player.name = playerName;                         // Stores the player's name input in the player object
        player.uid = firebase.auth().currentUser.uid;     // Stores firebase's unique id for the current user in the player object 

        // Listens for exactly one event and then stops listening
        database.ref().once('value').then(function(snapshot) {  

            if (!snapshot.child('players/1').exists()) { // If a snapsot of player 1 does not exist.. do the following
                database.ref('players/1/').update(player);    // Updates player 1's details in firebase
                var player_1_details = $('#player-1');       // Adds Player 1's name 
                var player_2_details;                       // Prevents duplicate player
                player_1_details.html(playerName + ' ');
                player_1 = 1;                           // Player count
                player_2 = 2;                          // Player count
                nameField.hide();                     // Hides initial name input on submit
                addPlayerButton.hide();              // Hides initial start button on submit
                $('#instructions').hide();
                
                playerCount.once('value').then(function(snapshot) { // Listens for player count
                    totalPlayers = snapshot.val();
                    if (totalPlayers === null) {
                        totalPlayers = 1;
                        playerCount.set(totalPlayers); // Updates the playerCount in the database = totalPlayers
                    } else {
                        totalPlayers++;
                        playerCount.set(totalPlayers);
                    }
                });

            } else if (!snapshot.child('players/2').exists()) { // If player 2 does not exist, create player 2

                database.ref('players/2/').update(player);
                var player_1_details = $('#player-2');
                var player_2_details;
                player_1_details.html(playerName + ' ');
                player_1 = 2;                         // Player count
                player_2 = 1                         // Player count
                nameField.hide();                   // Hides initial name input on submit
                addPlayerButton.hide();            // Hides initial start button on submit
                $('#instructions').hide();
                
                playerCount.once('value').then(function(snapshot) { // Listens for player count
                    totalPlayers = snapshot.val();
                    if (totalPlayers === null) {
                        totalPlayers = 1;
                        playerCount.set(totalPlayers); // Updates the playerCount in the database = totalPlayers
                    } else {
                        totalPlayers++;
                        playerCount.set(totalPlayers);
                    }
                });

            } else { // If two players are signed into the database alert that the game is full 
                alert('This game is currently full. Please try again later.');
            }

        });
    }

/*
========================================
Start Game
========================================
*/
    function startGame() {
        // Game Results / Round Outcome
        outcome.on('value', function(snapshot) {             
            $('#round-results').html(snapshot.val().gameResults + '');
        })
        // Player details from the database
        var playerOne = database.ref('players/' + player_1 + '/');
        var playerTwo = database.ref('players/' + player_2 + '/');

        // Player 1 details from the database
        playerOne.on('value', function(snapshot) {
            var data = snapshot.val();
            var playerOneName = data.name;
            var playerOneWins = data.wins;
            var playerOneLosses = data.losses;

            if (player_1 === 1) {
                $('#player-1').html(playerOneName + ' ');
                $('#score-1').html('Wins: ' + playerOneWins);
                $('#score-1').append('Losses: ' + playerOneLosses);
            } else {
                $('#player-2').html(playerOneName + ' ');
                $('#score-2').html('Wins: ' + playerOneWins);
                $('#score-2').append('Losses: ' + playerOneLosses);
            }
        })

        // Player 2 details from the database
        playerTwo.on('value', function(snapshot) {
            var data = snapshot.val();
            var playerTwoName = data.name;
            var playerTwoWins = data.wins;
            var playerTwoLosses = data.losses;
    
            if (player_1 === 1) {
                $('#player-2').html(playerTwoName + ' ');
                $('#score-2').html('Wins: ' + playerTwoWins);
                $('#score-2').append('Losses: ' + playerTwoLosses);
            } else {
                $('#player-1').html(playerTwoName + ' ')
                $('#player-1').html('Wins: ' + playerTwoWins)
                $('#score-1').append('Losses: ' + playerTwoLosses);
            }
        });

        // Clears player details when a player disconnects
        if (playerOne.onDisconnect().remove()) {
            playerCount.set(totalPlayers - 1);  // Updates player count
            choice = null;                      // Clears choices
        }

        // Player turns 
        database.ref('turn').set(1);   // Sets turn count to 1 
        database.ref('turn').on('value', function(snapshot) {
            var turn = snapshot.val();

            if (turn === player_1) {                             // If its player 1's turn... 
                $('#containerP-' + player_1).addClass('turn');
                $('#containerP-' + player_2).removeClass('turn');
                $('.choice-' + player_1).show();
            } else {                                              // If its player 2's turn... 
                $('#containerP-' + player_1).removeClass('turn');
                $('#containerP-' + player_2).addClass('turn');
                $('.choice-' + player_1).hide();

                var nextPlayer = database.ref('players/' + player_2 + '/name');
                nextPlayer.once('value', function(snapshot) {   // Once it's player 2's turn 
                    nextPlayer = snapshot.val();                // Once it's player 2's turn 
                    $('#status').html('It is ' + nextPlayer + '\'s turn');
                });
            }
        })
    };

    startGame()

/*
========================================
Outcome
========================================
*/
  //Check player count value in database. Trigger startGame function once value equal to 2
  playerCount.on("value", function(snapshot) {
    totalPlayers = snapshot.val();
    if (totalPlayers === 2) {
        startGame();
    }
});
/*
========================================
Chat
========================================
*/

})