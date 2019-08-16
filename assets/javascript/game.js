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
var turn = database.ref('turn');

var player = {                  // Stores player details
    name: "",
    choice: "",
    wins: 0,
    losses: 0,
    uid: ""
};

var currentTurn = null;
var player_1 = null;                // Sets up player 1
var player_2 = null;                // Sets up player 2
var totalPlayers = null;            // Sets up total number of players
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
$('#chat-box').hide();
$("#active-game").hide();
// $('#instructions').hide();

$(document).ready(function() {

/*
========================================
shoot Game
========================================
*/

$('#shoot').on('click', newPlayers);
var nameField = $('#userName');             // Hides name feild on click 
var addPlayerButton = $('#shoot');         // Stoes new play 
var convo = database.ref().child('chat');
var messageField = $('#message');
var chatLog = $('#chat-log');
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
                player_1_details.html('PLAYER 1: ' + playerName + ' ');
                player_1 = 1;                           // Player count
                player_2 = 2;                          // Player count
                nameField.hide();                     // Hides initial name input on submit
                addPlayerButton.hide();              // Hides initial shoot button on submit
                $('#instructions').hide();          // Hides instructions on player input 
                $("#player-1").show();             // Shows player 1 on player input 
                $("#player-2").show();            // Shows player 2 on player input 
                $('#chat-box').show();
                $("#active-game").show();
                console.log("This is tthe value of:" + player_1);
                database.ref('turn').set(1);
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
                var player_2_details = $('#player-2');
                var player_1_details;
                player_2_details.html('PLAYER 2: ' + playerName + ' ');
                player_2 = 2;                         // Player count
                player_1 = 1;                         // Player count
                nameField.hide();                   // Hides initial name input on submit
                addPlayerButton.hide();            // Hides initial shoot button on submit
                $('#instructions').hide();
                $("#player-1").show();            // Shows player 1 on player input 
                $("#player-2").show();           // Shows player 2 on player input 
                $('#chat-box').show();
                $("#active-game").show();
                console.log("This is tthe value of:" + player_2);
                database.ref('turn').set(2);

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
shoot Game
========================================
*/
    function shootGame() {

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
                // $('.choice-1').show(); 
                $("#score-1").show();
                $('#player-1').html('PLAYER 1: ' + playerOneName + ' ');
                $('#score-1').html('Wins: ' + playerOneWins + ' ');
                $('#score-1').append('Losses: ' + playerOneLosses + ' ');
            }
        })
        console.log("I am: " + player_1);

        // Player 2 details from the database
        playerTwo.on('value', function(snapshot) {
            var data = snapshot.val();
            var playerTwoName = data.name;
            var playerTwoWins = data.wins;
            var playerTwoLosses = data.losses;
    
            if (player_2 === 2) {
                // $('.choice-2').show(); 
                $("#score-2").show();
                $('#player-2').html('PLAYER 2: ' + playerTwoName + ' ');
                $('#score-2').html('Wins: ' + playerTwoWins + ' ');
                $('#score-2').append('Losses: ' + playerTwoLosses + ' ');
            }
        });
        console.log("I am: " + player_2);

        // Clears player details when a player disconnects
        if (playerOne.onDisconnect().remove()) {
            playerCount.set(totalPlayers - 1);  // Updates player count
            choice = null;                      // Clears choices
        }
        // Clears player details when a player disconnects
        if (playerTwo.onDisconnect().remove()) {
            playerCount.set(totalPlayers - 1);  // Updates player count
            choice = null;                      // Clears choices
        }

        // Player turns 
        database.ref('turn').set(1);   // Sets turn count to 1 
        database.ref('turn').on('value', function(snapshot) {
            var turn = snapshot.val();

            if (turn === null || turn === 1){
                playerOne.on('value', function(snapshot) {
                    var data = snapshot.val();
                    var playerOneName = data.name;
                    $('.choice-1').show();
                    $('.choice-2').hide();
                    $('#status').html('It is ' + playerOneName + '\'s turn');
                    console.log("please update to: " + playerOneName + "\"s turn");
                })
                console.log("it is player 1's turn");
            } else if (turn === 2){
                playerTwo.on('value', function(snapshot) {
                    var data = snapshot.val();
                    var playerTwoName = data.name;
                    $('.choice-1').hide();
                    $('.choice-2').show();
                    $('#status').html('It is ' + playerTwoName + '\'s turn');
                    console.log("please update to: " + playerTwoName + "\"s turn");
                })
                console.log("it is player 2's turn");
            }
           
        })
    };

/*
========================================
Outcome 
========================================
*/
 
    database.ref('gameResults').on('value', function(snapshot)  {    // 
        var data = snapshot.val().gameResults;   
        $('.round-results-2').html(data + ' ');                       // Adds the outcome to both players screens  
        console.log(data)
    })

    outcome.set({                       // Resets outcome 
        gameResults: gameResults
    })
/*
========================================
Player Count
========================================
*/
 
    playerCount.on("value", function(snapshot) {       // Checks player count 
        totalPlayers = snapshot.val();               
        if (totalPlayers === 2) {                      // If the total player count is 2 shoot the game 
            shootGame();
        }
        console.log(totalPlayers);
    });

/*
========================================
Turn Tracker
========================================
*/

    $(".resetTurn").on('click', function (){
        database.ref().once("value", function(snapshot) {
            var player_1_name = snapshot.child('players/' + player_1 + '/name').val();
            var player_2_name = snapshot.child('players/' + player_2 + '/name').val();


            turn.once('value').then(function(snapshot) { 
                currentTurn = snapshot.val();
                if (currentTurn === null) {
                    currentTurn = 1;
                    turn.set(currentTurn); 
                } else if (currentTurn === 1) {
                    currentTurn = 2;
                    turn.set(currentTurn); 
                    console.log("please update to: " + player_1_name + "\"s turn");
                    console.log("My turn should be 1: " + currentTurn);
                    console.log("player 1 clicked a button");
                } else if (currentTurn === 2) {
                    currentTurn = 1;
                    turn.set(currentTurn); 
                    console.log("please update to: " + player_2_name + "\"s turn");
                    console.log("My turn should be 2: " + currentTurn);
                    console.log("player 2: clicked a button");
                    
                }
            });
        });
    })
 
 
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
      
    }

/*
========================================
Submit Choices 
========================================
*/




    $('.choice-1').on('click', function(){
        var choice_1 = $(this).attr('data-choice');
        var update_p1_Choice = database.ref('players/' + player_1 + '/choice');
        update_p1_Choice.set(choice_1);
        console.log(choice_1);
        compareChoices();
    })

    $('.choice-2').on('click', function(){
        var choice_1 = $(this).attr('data-choice');
        var update_p2_Choice = database.ref('players/' + player_2 + '/choice');
        update_p2_Choice.set(choice_1);
        console.log(choice_1);
        compareChoices();
    });
    
/*
========================================
Choices
========================================
*/

    function compareChoices() {


        database.ref().once("value", function(snapshot) {

            // Player 1 database details
            var player_1_name = snapshot.child('players/' + player_1 + '/name').val();
            console.log("Player 1 is: " + player_1_name);
            var player_1_choice = snapshot.child('players/' + player_1 + '/choice').val();
            var player_1_wins = snapshot.child('players/' + player_1 + '/wins').val();
            var player_1_losses = snapshot.child('players/' + player_1 + '/losses').val();

            // Player 2 database details
            var player_2_name = snapshot.child('players/' + player_2 + '/name').val();
            console.log("Player 2 is: " +  player_2_name);
            var player_2_choice = snapshot.child('players/' + player_2 + '/choice').val();
            var player_2_wins = snapshot.child('players/' + player_2 + '/wins').val();
            var player_2_losses = snapshot.child('players/' + player_2 + '/losses').val();
    
            // Game Results
            var gameResults = snapshot.child
    
    
            if (player_1_choice === "paper") {
                if (player_2_choice === "scissors") {
                    player_2_wins++;
                        database.ref('players/' + player_2 + '/wins').set(player_2_wins);
                            gameResults = player_2_name + ' wins! ' + player_2_name + " you shredded " + player_1_name + " with scissors!";
                    
                    player_1_losses++;
                        database.ref('players/' + player_1 + '/losses').set(player_1_losses);
                    
                    outcome.update({ gameResults: gameResults });
                    // $('.round-results').html(player_2_name + ' wins! ' + player_2_name + " you shredded " + player_1_name + " with scissors!");
                    resetChoice();

                } else if (player_2_choice === "rock") {
                    player_1_wins++;
                        database.ref('players/' + player_1 + '/wins').set(player_1_wins);
                            gameResults = player_1_name + ' wins! ' + player_1_name + " you covered " + player_2_name + " with paper!";
                    
                    player_2_losses++; 
                        database.ref('players/' + player_2 + '/losses').set(player_2_losses);
                    
                    outcome.update({ gameResults: gameResults });
                    // $('.round-results').html(player_1_name + ' wins! ' + player_1_name + " you covered " + player_2_name + " with paper!");
                    resetChoice();

                } else if (player_2_choice === "paper") {
                    gameResults = 'Nice try, but it\'s a tie!';
                    outcome.update({ gameResults: gameResults });
                    // $('.round-results').html('Nice try, but it\'s a tie!');
                    resetChoice();
                }
    
    
            } else if (player_1_choice === "rock") {
                if (player_2_choice === "paper") {
                    player_2_wins++;
                        database.ref('players/' + player_2 + '/wins').set(player_2_wins);
                            gameResults = player_2_name + ' wins! ' + player_2_name + " you covered " + player_1_name + " with paper!";
                            console.log(gameResults);

                    player_1_losses++;
                        database.ref('players/' + player_1 + '/losses').set(player_1_losses);
                    
                    outcome.update({ gameResults: gameResults });
                    // $('.round-results').html(player_2_name + ' wins! ' + player_2_name + " you covered " + player_1_name + " with paper!");
                    resetChoice();
                    
                } else if (player_2_choice === "scissors") {
                    player_1_wins++;
                        database.ref('players/' + player_1 + '/wins').set(player_1_wins);
                            gameResults = player_1_name + ' wins! ' + player_1_name + " you knocked out " + player_2_name + " with a rock!";
                            console.log(gameResults);
                   
                        player_2_losses++;
                        database.ref('players/' + player_2 + '/losses').set(player_2_losses);
                   
                    outcome.update({ gameResults: gameResults });
                    // $('.round-results').html(player_1_name + ' wins! ' + player_1_name + " you knocked out " + player_2_name + " with a rock!");
                    resetChoice();

                } else if (player_2_choice === "rock") {
                    gameResults = 'Nice try, but it\'s a tie!';
                    console.log(gameResults);
                    outcome.set({ gameResults: gameResults });
                    // $('.round-results').html('Nice try, but it\'s a tie!');
                    resetChoice();
                }

            } else if (player_1_choice === "scissors") {
                if (player_2_choice === "rock") {
                    player_2_wins++;
                        database.ref('players/' + player_2 + '/wins').set(player_2_wins);
                            gameResults = player_2_name + ' wins! ' + player_2_name + " you knocked out " + player_1_name + " with a rock!";
                            console.log(gameResults);

                    player_1_losses++;
                        database.ref('players/' + player_1 + '/losses').set(player_1_losses);
                  
                    outcome.update({ gameResults: gameResults });
                    // $('.round-results').html(player_2_name + ' wins! ' + player_2_name + " you knocked out " + player_1_name + " with a rock!");
                    resetChoice();
               
                } else if (player_2_choice === "paper") {
                    player_1_wins++;
                        database.ref('players/' + player_1 + '/wins').set(player_1_wins);
                            gameResults = player_1_name + ' wins! ' + player_1_name + " you shredded " + player_2_name + " with scissors!";
                            console.log(gameResults);

                    player_2_losses++;
                    database.ref('players/' + player_2 + '/losses').set(player_2_losses);

                    outcome.update({ gameResults: gameResults });
                    // $('.round-results').html(player_1_name + ' wins ! ' + player_1_name + " you shredded " + player_2_name + " with scissors!");
                    resetChoice();

                } else if (player_2_choice === "scissors") {
                    gameResults = 'Nice try, but it\'s a tie!';
                    console.log(gameResults);
                    outcome.update({ gameResults: gameResults });
                    // $('.round-results').html('Nice try, but it\'s a tie!');
                    resetChoice();
                }
            }

        });
    }

/*
========================================
Chat 
========================================
*/
    $('#chat').on('click', function() {

        var message = {
            name: nameField.val(),
            message: messageField.val()
        };

        convo.push(message);
        messageField.val(' ');

    });

    convo.limitToLast(4).on('child_added', function(snapshot) {

        var data = snapshot.val();
        var player = data.name; 
        var message = data.message;

        var messageList = $('<li>');
        var playerName = $('<span id="playerName"></span>');
        playerName.html(player + ": ");
        messageList.html(message).prepend(playerName);
        chatLog.prepend(messageList);
    
    });

    convo.onDisconnect().remove();          // Remove chat when the game is disconnected 

})