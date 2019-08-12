/*
========================================
RPS - Multiplayer Game 
========================================
*/
$(document).ready(function(){
/*
========================================
Firebase configuration
========================================
*/
var config = {
    apiKey: "AIzaSyDjD6f9WuqO9tlDUrU_Pb_HwMvFOGrOE2M",
    authDomain: "rps-multiplayer-e6ab6.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-e6ab6.firebaseio.com",
    storageBucket: "rps-multiplayer-e6ab6.appspot.com",
    messagingSenderId: "1062565958363",
  };

firebase.initializeApp(config);    // Initialize Firebase

/*
========================================
GLOBAL VARIABLES 
========================================
*/

var database = firebase.database(); // Get a reference to the database service
var userName = "";
var email = "";
var buttonClick = 2;

$('#player-1-details').hide();
$('#player-2-details').hide();
$("#submit-player-1").hide();
$("#submit-player-2").hide();
/*
========================================
Fire-base Authentication 
========================================
*/
    database.ref().on("value", function(snapshot) {
        if (snapshot.child("userName").exists() && snapshot.child("email").exists()){
        
        userName = snapshot.val().userName
        email = snapshot.val().email
        
    }
        }, function(errorObject) {
            console.log("The read failed: " + errorObject.code);
            });

/*
========================================
Player 1 Details
========================================
*/
    function player1Details() {
        $("#submit-player-1").on("click", function(event) {
            event.preventDefault();
            
            for (var i = 0; i < buttonClick; i++) {
                buttonClick--
                if (buttonClick === 0){
                    $('#active-game').show();
                    $('#instructions').hide();
                    console.log("start the game");
                }
                console.log(buttonClick);
            }
            
            $("#player-1-details").hide();
            
            var userName = $("#entry-userName-1").val().trim();
            var email = $("#entry-email-1").val().trim();

            database.ref().push({
            userName: userName,
            email: email,
            });
                console.log(userName);
                console.log(email);
            
            $("#player-1-ready").text("Player 1: " + userName + " is ready!")
        });

        $("#entry-userName-1").keyup(function() {
            $("#submit-player-1").show();
        });

    }

/*
========================================
Player 2 Details
========================================
*/
   
    function player2Details() {
        $("#submit-player-2").on("click", function(event) {
            event.preventDefault();
            
            for (var i = 0; i < buttonClick; i++) {
                buttonClick--
                if (buttonClick === 0){
                    $('#active-game').show();
                    $('#instructions').hide();
                    console.log("start the game");
                }
                console.log(buttonClick);
            }
            
            $("#player-2-details").hide();
            
            var userName = $("#entry-userName-2").val().trim();
            var email = $("#entry-email-2").val().trim();

            database.ref().push({
            userName: userName,
            email: email,
            });
                console.log(userName);
                console.log(email);
            
            $("#player-2-ready").text("Player 2: " + userName + " is ready!")
        });

        $("#entry-userName-2").keyup(function() {
            $("#submit-player-2").show();
        });

    }

/*
========================================
Start Game
========================================
*/

    function startGame(){
    
        if (buttonClick != 0){
            $('#active-game').hide();
            console.log("Player Details");
        }
        $('#button-player-1').on("click", function(event){
            event.preventDefault();
            $('#player-1-details').toggle();
        });

        player1Details();

        $('#button-player-2').on("click", function(event){
            event.preventDefault();
            $('#player-2-details').toggle();
        });
        
        player2Details();

    }
    
    startGame()
    

/*
========================================
Fire-base Chat functionality
========================================
*/


// function sendChatMessage(){
//     ref = database.ref().ref("/chat");
//     messageFeild = document.querySelector("#message-input");

//     ref.push().set ({
//         name: firebase.auth().currentUser.userName,
//         message: messageFeild.value,
//     })
// }
// console.log(userName);



})
