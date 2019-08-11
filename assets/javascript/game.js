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
    projectId: "rps-multiplayer-e6ab6",
    storageBucket: "",
    messagingSenderId: "1062565958363",
    appId: "1:1062565958363:web:ec1df26c1943f070"
  };

firebase.initializeApp(config);    // Initialize Firebase

/*
========================================
GLOBAL VARIABLES 
========================================
*/

var database = firebase.database(); // Get a reference to the database service

/*
========================================
Fire-base Authentication 
========================================
*/

/*
========================================
Fire-base Chat functionality
========================================
*/



$('#active-game').hide(); // Hides active game section
