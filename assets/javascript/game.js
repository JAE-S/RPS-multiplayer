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


$("#containerP-1").hide();
$("#containerP-2").hide();
$('#chat-box').hide();
$("#active-game").hide();


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
                $('#waiting').html(playerName + " You are currently the only player online." + '<br>' + "Share a link to this page with a friend to start playing!" + '<br>' + "Waiting for player 2...");
                player_1 = 1;                           // Player count
                database.ref('turn').set(1);
                nameField.hide();                     // Hides initial name input on submit
                addPlayerButton.hide();              // Hides initial shoot button on submit
                $('#instructions').hide();          // Hides instructions on player input 
                $('.choice-1').hide();
                $("#containerP-1").show();
                $("#containerP-2").hide();
             
                $('#chat-box').show();
                $("#active-game").show();
                console.log("This is tthe value of:" + player_1);
                playerCount.set(1);   // Sets turn count to 1 
                totalPlayers = 1;

            } else if (!snapshot.child('players/2').exists()) { // If player 2 does not exist, create player 2

                database.ref('players/2/').update(player);
                var player_2_details = $('#player-2');
                var player_1_details;
                player_2_details.html('PLAYER 2: ' + playerName + ' ');

                player_2 = 2;                         // Player count
                database.ref('turn').set(1);
                nameField.hide();                   // Hides initial name input on submit
                addPlayerButton.hide();            // Hides initial shoot button on submit
                $('#instructions').hide();
                $("#containerP-2").show();
                $('.choice-2').hide();
                $("#containerP-1").hide();
                $('#chat-box').show();
                $("#active-game").show();
                console.log("This is tthe value of:" + player_2);
                playerCount.set(2);   // Sets turn count to 1 
                totalPlayers = 2;

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
        var playerOne = database.ref('players/1/');
        var playerTwo = database.ref('players/2/');

        // Player 1 details from the database
        playerOne.on('value', function(snapshot) {
            var data = snapshot.val();
            var playerOneName = data.name;
            var playerOneWins = data.wins;
            var playerOneLosses = data.losses;

            if (player_1 === 1) {
                $('#waiting').delay(1000).fadeOut('slow'); 
                $('#player-1').html('PLAYER 1: ' + playerOneName + ' ');
                $('#score-1').html('Wins: ' + playerOneWins + ' ');
                $('#score-1').append('Losses: ' + playerOneLosses + ' ');
            }
        })
   
        // Player 2 details from the database
        playerTwo.on('value', function(snapshot) {
            var data = snapshot.val();
            var playerTwoName = data.name;
            var playerTwoWins = data.wins;
            var playerTwoLosses = data.losses;
    
            if (player_2 === 2) {
        
                $('#player-2').html('PLAYER 2: ' + playerTwoName + ' ');
                $('#score-2').html('Wins: ' + playerTwoWins + ' ');
                $('#score-2').append('Losses: ' + playerTwoLosses + ' ');

            } 
        });

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
                    $('#status').html('It is ' + playerOneName + '\'s turn');
                    console.log("please update to: " + playerOneName + "\"s turn");
                    if(turn === 1){
                        $('.choice-1').show();
                    } else {
                        $('.choice-1').hide();
                    }
                })
                console.log("it is player 1's turn");
            } else if (turn === 2){
                playerTwo.on('value', function(snapshot) {
                    var data = snapshot.val();
                    var playerTwoName = data.name;
        
                    $('#status').html('It is ' + playerTwoName + '\'s turn');
                    console.log("please update to: " + playerTwoName + "\"s turn");
                    if(turn === 2){
                        $('.choice-2').show();
                    } else {
                        $('.choice-2').hide();
                    }
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
        $('.round-results-2').fadeIn('slow');
            $('.round-results-2').html(data + ' ');                       // Adds the outcome to both players screens  
            $('.round-results-2').delay(3000).fadeOut('slow'); 
      
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
        console.log('Total number of active players: ' + totalPlayers);
    });

/*
========================================
Turn Tracker
========================================
*/

    $(".resetTurn").on('click', function (){
        
        database.ref().once("value", function(snapshot) {
            var player_1_name = snapshot.child('players/1/name').val();
            var player_2_name = snapshot.child('players/2/name').val();
            $('.choice-2').hide();
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
        var update_p1_Choice = database.ref('players/1/choice');
        var update_p2_Choice = database.ref('players/2/choice');
        update_p1_Choice.set(choice);
        update_p2_Choice.set(choice);
    }

/*
========================================
Submit Choices 
========================================
*/

     $(document).on('click', '.choice-1', function(){
        var choice_1 = $(this).attr('data-choice');
        var update_p1_Choice = database.ref('players/1/choice');
        update_p1_Choice.set(choice_1);
        console.log(choice_1);
        $('.choice-1').fadeOut('slow'); 
        compareChoices();
    })

    $(document).on('click', '.choice-2', function(){
        var choice_1 = $(this).attr('data-choice');
        var update_p2_Choice = database.ref('players/2/choice');
        update_p2_Choice.set(choice_1);
        console.log(choice_1);
        $('.choice-2').fadeOut('slow'); 
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
            var player_1_name = snapshot.child('players/1/name').val();
            console.log("Player 1 is: " + player_1_name);
            var player_1_choice = snapshot.child('players/1/choice').val();
            var player_1_wins = snapshot.child('players/1/wins').val();
            var player_1_losses = snapshot.child('players/1/losses').val();

            // Player 2 database details
            var player_2_name = snapshot.child('players/2/name').val();
            console.log("Player 2 is: " +  player_2_name);
            var player_2_choice = snapshot.child('players/2/choice').val();
            var player_2_wins = snapshot.child('players/2/wins').val();
            var player_2_losses = snapshot.child('players/2/losses').val();
    
            // Game Results
            var gameResults = snapshot.child
    
    
            if (player_1_choice === "paper") {
                if (player_2_choice === "scissors") {
                    player_2_wins++;
                        database.ref('players/2/wins').set(player_2_wins);
                            gameResults = player_2_name + ' wins! ' + player_2_name + " you shredded " + player_1_name + " with scissors!";
                    
                    player_1_losses++;
                        database.ref('players/1/losses').set(player_1_losses);
                    
                    outcome.update({ gameResults: gameResults });
               
                    resetChoice();

                } else if (player_2_choice === "rock") {
                    player_1_wins++;
                        database.ref('players/1/wins').set(player_1_wins);
                            gameResults = player_1_name + ' wins! ' + player_1_name + " you covered " + player_2_name + " with paper!";
                    
                    player_2_losses++; 
                        database.ref('players/2/losses').set(player_2_losses);
                    
                    outcome.update({ gameResults: gameResults });
                 
                    resetChoice();

                } else if (player_2_choice === "paper") {
                    gameResults = 'Nice try, but it\'s a tie!';
                    outcome.update({ gameResults: gameResults });
                    resetChoice();
                }
    
    
            } else if (player_1_choice === "rock") {
                if (player_2_choice === "paper") {
                    player_2_wins++;
                        database.ref('players/2/wins').set(player_2_wins);
                            gameResults = player_2_name + ' wins! ' + player_2_name + " you covered " + player_1_name + " with paper!";
                            console.log(gameResults);

                    player_1_losses++;
                        database.ref('players/1/losses').set(player_1_losses);
                    
                    outcome.update({ gameResults: gameResults });
                
                    resetChoice();
                    
                } else if (player_2_choice === "scissors") {
                    player_1_wins++;
                        database.ref('players/1/wins').set(player_1_wins);
                            gameResults = player_1_name + ' wins! ' + player_1_name + " you knocked out " + player_2_name + " with a rock!";
                            console.log(gameResults);
                   
                        player_2_losses++;
                        database.ref('players/2/losses').set(player_2_losses);
                   
                    outcome.update({ gameResults: gameResults });
                  
                    resetChoice();

                } else if (player_2_choice === "rock") {
                    gameResults = 'Nice try, but it\'s a tie!';
                    console.log(gameResults);
                    outcome.set({ gameResults: gameResults });
                
                    resetChoice();
                }

            } else if (player_1_choice === "scissors") {
                if (player_2_choice === "rock") {
                    player_2_wins++;
                        database.ref('players/2/wins').set(player_2_wins);
                            gameResults = player_2_name + ' wins! ' + player_2_name + " you knocked out " + player_1_name + " with a rock!";
                            console.log(gameResults);

                    player_1_losses++;
                        database.ref('players/1/losses').set(player_1_losses);
                  
                    outcome.update({ gameResults: gameResults });
                   
                    resetChoice();
               
                } else if (player_2_choice === "paper") {
                    player_1_wins++;
                        database.ref('players/1/wins').set(player_1_wins);
                            gameResults = player_1_name + ' wins! ' + player_1_name + " you shredded " + player_2_name + " with scissors!";
                            console.log(gameResults);

                    player_2_losses++;
                    database.ref('players/2/losses').set(player_2_losses);

                    outcome.update({ gameResults: gameResults });
               
                    resetChoice();

                } else if (player_2_choice === "scissors") {
                    gameResults = 'Nice try, but it\'s a tie!';
                    console.log(gameResults);
                    outcome.update({ gameResults: gameResults });
        
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