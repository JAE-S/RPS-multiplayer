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
$("#player-1").hide();
$("#player-2").hide();
$("#score-1").hide();
$("#score-2").hide();
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
                $('#instructions').hide();          // Hides instructions on player input 
                $("#player-1").show();             // Shows player 1 on player input 
                $("#player-2").show();            // Shows player 2 on player input 
                
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
                $("#player-1").show();            // Shows player 1 on player input 
                $("#player-2").show();           // Shows player 2 on player input 

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
    console.log(player); 

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
                $('.choice-1').show(); 
                $("#score-1").show();
                $('#player-1').html(playerOneName + ' ');
                $('#score-1').html('Wins: ' + playerOneWins + ' ');
                $('#score-1').append('Losses: ' + playerOneLosses + ' ');
            } else {
                $('.choice-2').show(); 
                $("#score-2").show();
                $('#player-2').html(playerOneName + ' ');
                $('#score-2').html('Wins: ' + playerOneWins + ' ');
                $('#score-2').append('Losses: ' + playerOneLosses + ' ');
            }
        })
        console.log(playerOne);

        // Player 2 details from the database
        playerTwo.on('value', function(snapshot) {
            var data = snapshot.val();
            var playerTwoName = data.name;
            var playerTwoWins = data.wins;
            var playerTwoLosses = data.losses;
    
            if (player_1 === 1) {
                $('.choice-2').show(); 
                $("#score-2").show();
                $('#player-2').html(playerTwoName + ' ');
                $('#score-2').html('Wins: ' + playerTwoWins + ' ');
                $('#score-2').append('Losses: ' + playerTwoLosses + ' ');
            } else {
                $('.choice-1').show(); 
                $("#score-1").show();
                $('#player-1').html(playerTwoName + ' ');
                $('#score-1').html('Wins: ' + playerTwoWins + ' ');
                $('#score-1').append('Losses: ' + playerTwoLosses + ' ');
            }
        });
        console.log(playerTwo);

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
                // $('.choice-' + player_1).show();
            } else {                                              // If its player 2's turn... 
                $('#containerP-' + player_1).removeClass('turn');
                $('#containerP-' + player_2).addClass('turn');
                // $('.choice-' + player_1).hide();

                var nextPlayer = database.ref('players/' + player_2 + '/name');
                nextPlayer.once('value', function(snapshot) {   // Once it's player 2's turn 
                    nextPlayer = snapshot.val();                // Once it's player 2's turn 
                        $('#status').html('It is ' + nextPlayer + '\'s turn');
              
                });
            }
        })
    };

/*
========================================
Player Count
========================================
*/
 
    playerCount.on("value", function(snapshot) {       // Checks player count 
        totalPlayers = snapshot.val();               
        if (totalPlayers === 2) {                      // If the total player count is 2 start the game 
            startGame();
        }
        console.log(totalPlayers);
    });

/*
========================================
Submit Choices
========================================
*/
    function submitChoice() {

        var choice = $(this).attr('data-choice');
        var updateChoice = database.ref('players/' + player_1 + '/choice');
            updateChoice.set(choice);
         
        database.ref('players/' + player_2 + '/choice').on('value', function(snapshot) {
            compareChoices();
        });
        // $('.choice-1').hide();
        // $('.choice-2').hide();
        var updateTurn = database.ref('turn');
        
        updateTurn.once('value', function(snapshot) {
            var currentTurn = snapshot.val();

            if (currentTurn === 1) {
                database.ref('turn').set(2);
            } else {
                database.ref('turn').set(1);
            }
        });
    }

 
/*
========================================
Reset Choices 
========================================
*/

    function resetChoice() {

        var choice = "";
        var update_p1_Choice = database.ref('players/' + player_1 + '/choice');
        var update_p2_Choice = database.ref('players/' + player_2 + '/choice');
        update_p1_Choice.set(choice);
        update_p2_Choice.set(choice);
        // $('#round-results').html(' ');

    }

    $('.choice-1').on('click', submitChoice);
    $('.choice-2').on('click', submitChoice);

/*
========================================
Choices
========================================
*/

    function compareChoices() {

        database.ref().once("value", function(snapshot) {

            // Player 1 database details
            var player_1_name = snapshot.child('players/' + player_1 + '/name').val();
            console.log(player_1_name);
            var player_1_choice = snapshot.child('players/' + player_1 + '/choice').val();
            var player_1_wins = snapshot.child('players/' + player_1 + '/wins').val();
            var player_1_losses = snapshot.child('players/' + player_1 + '/losses').val();

            // Player 2 database details
            var player_2_name = snapshot.child('players/' + player_2 + '/name').val();
            console.log(player_2_name);
            var player_2_choice = snapshot.child('players/' + player_2 + '/choice').val();
            var player_2_wins = snapshot.child('players/' + player_2 + '/wins').val();
            var player_2_losses = snapshot.child('players/' + player_2 + '/losses').val();
    
            // Game Results
            var gameResults = snapshot.child
    
    
            if (player_1_choice === "paper") {
                if (player_2_choice === "scissors") {
                    player_2_wins++;
                        database.ref('players/' + player_2 + '/wins').set(player_2_wins);
                            gameResults = player_2_name + ' wins!';
                    
                    player_1_losses++;
                        database.ref('players/' + player_1 + '/losses').set(player_1_losses);
                    
                    outcome.update({ gameResults: gameResults });
                    resetChoice()

                } else if (player_2_choice === "rock") {
                    player_1_wins++;
                        database.ref('players/' + player_1 + '/wins').set(player_1_wins);
                            gameResults = player_1_name+ ' wins!';
                    
                    player_2_losses++; 
                        database.ref('players/' + player_2 + '/losses').set(layer_2_losses);
                    
                    outcome.update({ gameResults: gameResults });
                    resetChoice()

                } else if (player_2_choice === "paper") {
                    gameResults = 'It\'s a tie!';
                    outcome.update({ gameResults: gameResults });
                    resetChoice()
                }
    
    
            } else if (player_1_choice === "rock") {
                if (player_2_choice === "paper") {
                    player_2_wins++;
                        database.ref('players/' + player_2 + '/wins').set(player_2_wins);
                            gameResults = player_2_name + ' wins!';

                    player_1_losses++;
                        database.ref('players/' + player_1 + '/losses').set(player_1_losses);
                    
                    outcome.update({ gameResults: gameResults });
                    resetChoice()
                    
                } else if (player_2_choice === "scissors") {
                    player_1_wins++;
                        database.ref('players/' + player_1 + '/wins').set(player_1_wins);
                            gameResults = player_1_name + ' wins!';
                    
                    player_2_losses++;
                        database.ref('players/' + player_2 + '/losses').set(player_2_losses);
                   
                    outcome.update({ gameResults: gameResults });
                    resetChoice()

                } else if (player_2_choice === "rock") {
                    gameResults = 'It\'s a tie!';
                    outcome.update({ gameResults: gameResults });
                    resetChoice()
                }

            } else if (player_1_choice === "scissors") {
                if (player_2_choice === "rock") {
                    player_2_wins++;
                        database.ref('players/' + player_2 + '/wins').set(player_2_wins);
                            gameResults = player_2_name + ' wins!';
                    
                    player_1_losses++;
                        database.ref('players/' + player_1 + '/losses').set(player_1_losses);
                  
                    outcome.update({ gameResults: gameResults });
                    resetChoice()
               
                } else if (player_2_choice === "paper") {
                    player_1_wins++;
                        database.ref('players/' + player_1 + '/wins').set(player_1_wins);
                            gameResults = player_1_name + ' wins!';
                    
                    player_2_losses++;
                    database.ref('players/' + player_2 + '/losses').set(player_2_losses);

                    outcome.update({ gameResults: gameResults });
                    resetChoice()

                } else if (player_2_choice === "scissors") {
                    gameResults = 'It\'s a tie!';
                    outcome.update({ gameResults: gameResults });
                    resetChoice()
                }
            }
           
        });
    }

/*
========================================
Chat
========================================
*/
outcome.set({
    gameResults: gameResults
})



})