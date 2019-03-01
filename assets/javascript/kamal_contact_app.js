// Initialize Firebase
var config = {
    apiKey: "AIzaSyAddosdnLHXdc1vMYD0UEz0geb7oljK9_Y",
    authDomain: "fir-project-7da0a.firebaseapp.com",
    databaseURL: "https://fir-project-7da0a.firebaseio.com",
    projectId: "fir-project-7da0a",
    storageBucket: "fir-project-7da0a.appspot.com",
    messagingSenderId: "779232897200"
};
firebase.initializeApp(config);
var dataRef = firebase.database();

// global variables
var userName;
var userEmail;
var userSub;
var userComm;
var errMsg = ["Enter the your full name", "Enter a valid email address e.g. john@aol.com", "Enter the subject", "Enter a detailed comment"];

// clear out error messages once the user clicks on an input field
$(".form-control").on("click", function () {
    $("#userName-input-error").text("");
    $("#userEmail-input-error").text("");
    $("#userSub-input-error").text("");
    $("#userComm-input-error").text("");
});

// actions after clicking on submit button
$("#add-contact-btn").on("click", function (event) {
    event.preventDefault();

    var isRight = true;
    // grabing field values from browser
    userName = $("#userName").val().trim();
    userEmail = $("#userEmail").val().trim();
    userSub = $("#userSub").val().trim();
    userComm = $("#userComm").val().trim();

    // checking format of email field PENDING
    if (!validateEmail(userEmail)) {
        userEmail = "";
    }

    // making sure all fields pass validation
    if (userName === "") {
        $("#userName-input-error").text(errMsg[0]);
        $("#userName-input-error").show();
        isRight = false;
    }
    if (userEmail === "") {
        $("#userEmail-input-error").text(errMsg[1]);
        $("#userEmail-input-error").show();
        isRight = false;
    }
    if (userSub === "") {
        $("#userSub-input-error").text(errMsg[2]);
        $("#userSub-input-error").show();
        isRight = false;
    }
    if (userComm < 1) {
        $("#userComm-input-error").text(errMsg[3]);
        $("#userComm-input-error").show();
        isRight = false;
    }

    // if all fields pass validation then do next step
    if (isRight) {

        // writing in the database
        dataRef.ref().push({
            userName: userName,
            userEmail: userEmail,
            userSub: userSub,
            userComm: userComm,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });

        // clearing the fields
        $("#userName").val("");
        $("#userEmail").val("");
        $("#userSub").val("");
        $("#userComm").val("");

        // send email to customer service mailbox using POSTMAIL
        var data = {
            "access_token": "cyhwsf1jf171h4swil5qtua0"
        };

        var subject = userName + ":- " + userSub;
        var message = userComm;
        data['subject'] = subject;
        data['text'] = message;

        $.post('https://postmail.invotes.com/send', data);
    }
});

// validating email format
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}