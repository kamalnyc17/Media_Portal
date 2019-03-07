// Initialize Firebase
var config = {
    apiKey: "AIzaSyDb8mX_qRi3pRr874lgMSzByCHNrpD0LOM",
    authDomain: "thisisfbase.firebaseapp.com",
    databaseURL: "https://thisisfbase.firebaseio.com",
    projectId: "thisisfbase",
    storageBucket: "thisisfbase.appspot.com",
    messagingSenderId: "1072121948405"
};
firebase.initializeApp(config);

var dataRef1 = firebase.database();

// variables for the schedule table
var conName;
var conRating;
var conFeedback;

// clear out error messages once the user clicks on an input field
$(".form-control").on("click", function () {
    $("#conName-input-error").text("");
    $("#conRating-input-error").text("");
    $("#conFeedback-input-error").text("");
});

// loading the table with existing feedback from the database
dataRef1.ref().on("value", function (snapshot) {
    $("#feedback-table > tbody").empty();
    var feedbackCount = 0;
    snapshot.forEach(function (childSnapshot) {
        if (feedbackCount < 10) {
            if (parseInt(childSnapshot.val().conRating) >= 4) { // show ratings 4 or 5 only
                var newRow = $("<tr>").append(
                    $("<td>").text(childSnapshot.val().conName),
                    $("<td>").text(childSnapshot.val().conRating),
                    $("<td>").text(childSnapshot.val().conFeedback)
                );
                // Append the new row to the table
                $("#feedback-table > tbody").append(newRow);
                feedbackCount++;
            }
        }
    });
});

// actions after clicking on submit button
$("#add-feedback-btn").on("click", function (event) {
    event.preventDefault();

    // grabing field values from browser
    conName = $("#conName").val().trim();
    conRating = $("input[id='conRating']:checked").val();
    conFeedback = $("#conFeedback").val().trim();

    // checking time format & value for train time
    var isRight = true;
    var errMsg = ["Enter your full name", "Select a Rating between 1 to 5", "Enter a Detailed Feedback"];

    if (conName === "") {
        $("#conName-input-error").text(errMsg[0]);
        $("#conName-input-error").show();
        isRight = false;
    }
    if (!$("input[id='conRating']").is(':checked')) {
        $("#conRating-input-error").text(errMsg[1]);
        $("#conRating-input-error").show();
        isRight = false;
    }
    if (conFeedback === "") {
        $("#conFeedback-input-error").text(errMsg[2]);
        $("#conFeedback-input-error").show();
        isRight = false;
    }

    // if all fields pass validation then do next step
    if (isRight) {
        // writing in the database
        dataRef1.ref().push({
            conName: conName,
            conRating: conRating,
            conFeedback: conFeedback,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });

        // clearing the fields
        $("#conName").val("");
        $('input[name="question"]').prop('checked', false);
        $("#conFeedback").val("");

        // appending in the table only if the rating is 4 or 5
        if (parseInt(conRating) >= 4) {
            var newRow = $("<tr>").append(
                $("<td>").text(conName),
                $("<td>").text(conRating),
                $("<td>").text(conFeedback)
            );

            // Append the new row to the table
            $("#feedback-table > tbody").append(newRow);
        }
    }
});