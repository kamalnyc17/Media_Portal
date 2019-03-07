// global variables
var timeNow; //setInterval variable
/* news media portal variables */
var ytChannelID = ["UCun4tg1BecN4PuxwZ6mL3NA", "UCXIJgqnII2ZOINSWNOGFThA", "UCmgnsaQIK1IR808Ebde-ssA", "UCupvZG-5ko_eiXAupbDfxWw", "UCaXkIU1QidjPwiAYu6GcHjg", "UCHd62-u_v4DvJ8TCFtpi4GA"]
var ytAPIkey = "AIzaSyDwNPeSARNW9VJI2fY3EJgGAYz2HewTjqo"
var ytQueryURL = ""
var ytMaxResults = "5"
/* contact page variables */
var userName;
var userEmail;
var userSub;
var userComm;
var errMsg = ["Enter the your full name", "Enter a valid email address e.g. john@aol.com", "Enter the subject", "Enter a detailed comment"];
/* feedback page variables */
var conName;
var conRating;
var conFeedback;
/* backup API Keys
  AIzaSyDzIYi0kQBAoQQgjq6-lp2-RtOH0I7oJRs, AIzaSyBW3X4R4Eke37gYShO54y5WtSR9LtvhLL0, AIzaSyDwNPeSARNW9VJI2fY3EJgGAYz2HewTjqo, AIzaSyC-SwoIU-bXwFM9KCmd9XobZGuy35IEv3E, AIzaSyDzIYi0kQBAoQQgjq6-lp2-RtOH0I7oJRs
*/
/* homepage related scripts */
// current location - main function
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        $("#location").text("Geolocation is not supported by this browser.");
    }
}

// current location - call back function
function showPosition(position) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&appid=e7c19489986c1a711e1a0f56bb3588ac";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var kelvin = response.main.temp;
        var fahren = Math.round((kelvin - 273.15) * 9 / 5 + 32);
        $("#temp").text(" " + fahren + "\xB0 F");
    })

    // getting city & state
    queryURL = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude + "&key=AIzaSyAGPuyRIadIm4gi1vFbk5YYc65JMhOK0Ag"
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        $("#location").text(" " + response.plus_code.compound_code.substring(8, response.plus_code.compound_code.length))
    })
}

// current time  
function getTime() {
    $("#time").text(" " + moment().format("hh:mm A"));
    clearInterval(timeNow);
    timeNow = setInterval(getTime, 1000 * 60);
}

// call all the functions
$(document).ready(function () {
    // current time  
    getTime();

    // current location
    getLocation();
})
/* homepage script end here */

/* news / media portal script */
// video pop up
$(document).ready(function () {
    $("#myModal").on("hidden.bs.modal", function () {
        $("#iframeYoutube").attr("src", "#");
    })
})

function changeVideo(vId) {
    var iframe = document.getElementById("iframeYoutube");
    iframe.src = "https://www.youtube.com/embed/" + vId;

    $("#myModal").modal("show");
}

// the following function scans all news articles and fetches what the user wants
function runSearch() {
    var searchTerm = $("#searchTerm").val().trim();

    // we are pulling 5 pages worth of data
    for (var j = 1; j < 6; j++) {
        var queryURL =
            "https://newsapi.org/v2/everything?q=" + searchTerm + "&from=2019-03-07&sortBy=popularity?sources=cnn&apiKey=1f24541f63fa4ac79c46c7df37094bed&pageSize=100&page=" +
            j.toString().trim();

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            // the api will return upto 100 articles per page
            for (var i = 0; i < 99; i++) {
                // make sure the media source we are looking for
                var sourceName = response.articles[i].source.name.toUpperCase();

                if ((sourceName === "CNN") || (sourceName === "FOX NEWS") || (sourceName === "THE WASHINGTON POST") ||
                    (
                        sourceName === "NATIONAL REVIEW") || (sourceName === "MSNBC") || (sourceName === "BREITBART NEWS")) {
                    if (sourceName === "THE WASHINGTON POST") {
                        sourceName1 = "THE-WASHINGTON-POST";
                    } else {
                        sourceName1 = sourceName.replace(" ", "-");
                    }

                    // Create a new table row element
                    var tRow = $("<tr class='" + sourceName1 + "'>");
                    var sourceID = $("<td>").html('<a href="' + response.articles[i].url + '" target="_blank">' + response.articles[i].source.name + '</a></td></tr>');
                    var summary = $("<td>").text(response.articles[i].description);
                    tRow.append(sourceID, summary);

                    // Append the table row to the table body
                    $(".newsarticle > tbody").append(tRow);
                }
            }
        });
    }
}

function youtubeSearch() {
    var searchTerm = $("#searchTerm").val().trim();
    var ytChannelName = ["NATIONAL-REVIEW", "FOX-NEWS", "BREITBART-NEWS", "CNN", "MSNBC", "THE-WASHINGTON-POST"];

    for (var j = 0; j < 6; j++) {
        ytQueryURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" + ytChannelID[j] + "&maxResults=" + ytMaxResults + "&q=" + searchTerm + "&type=video&videoDefinition=any&key=" + ytAPIkey;
        var sourceName1 = ytChannelName[j];

        $.ajax({
            url: ytQueryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response)
            for (var i = 0; i < 5; i++) {
                // make sure the channel names are same between youtube and articles
                sourceName1 = response.items[i].snippet.channelTitle.toUpperCase();

                if (sourceName1 === "WASHINGTON POST") {
                    sourceName2 = "THE-WASHINGTON-POST";
                } else {
                    sourceName2 = sourceName1.replace(" ", "-");
                }
                // remove special charecters
                var regExpr = /[^a-zA-Z0-9-. ]/g;
                var userText = response.items[i].snippet.title;
                var summary1 = userText.replace(regExpr, " ");

                // Create a new table row element
                var tRow = $("<tr class='" + sourceName2 + "'>");
                var sourceID = $("<td>").html('<a href="https://www.youtube.com/watch?v=' + response.items[i].id.videoId + '" target="_blank">' + sourceName1 + '</a></td></tr>');
                var summary = $("<td>").text(summary1);
                
                var imgLink = $("<td>").html("<a onclick='changeVideo(" + '"' + response.items[i].id.videoId + '"' + ")'>" + '<img src="' + response.items[i].snippet.thumbnails.default.url + '"></a></td></tr>');

                console.log("<a onclick='changeVideo(" + '"' + response.items[i].id.videoId + '"' + ")'>");
                tRow.append(sourceID, summary, imgLink);

                // Append the table row to the table body
                $(".newsvideo > tbody").append(tRow);
            }
        });

    }
}

// search all button
$("#add-search-btn").on("click", function () {
    runSearch();
    youtubeSearch();
    $(".newsarticle, .newsarticleH2").show();
    $(".newsvideo, .newsvideoH2").show();
})
// search article button
$("#add-article-btn").on("click", function () {
    $(".newsvideo, .newsvideoH2").hide();
    runSearch();
    $(".newsarticle, .newsarticleH2").show();
})
// search video button
$("#add-video-btn").on("click", function () {
    $(".newsarticle, .newsarticleH2").hide();
    youtubeSearch();
    $(".newsvideo, .newsvideoH2").show();
})

//  hide atricle/video based on what channel was clicked
// liberal media
$("#add-liberal-btn").on("click", function () {
    $(".THE-WASHINGTON-POST, .MSNBC, .CNN").show();
    $(".BREITBART-NEWS, .FOX-NEWS ,.NATIONAL-REVIEW").hide();
})
$("#add-msnbc-btn").on("click", function () {
    $(".MSNBC").show();
    $(".THE-WASHINGTON-POST, .NATIONAL-REVIEW, .BREITBART-NEWS, .CNN, .FOX-NEWS").hide();
})
$("#add-cnn-btn").on("click", function () {
    $(".CNN").show();
    $(".MSNBC, .THE-WASHINGTON-POST, .NATIONAL-REVIEW, .BREITBART-NEWS, .FOX-NEWS").hide();
})
$("#add-washington-btn").on("click", function () {
    $(".THE-WASHINGTON-POST").show();
    $(".MSNBC, .NATIONAL-REVIEW, .BREITBART-NEWS, .CNN, .FOX-NEWS").hide();
})

// consevative media    
$("#add-conservative-btn").on("click", function () {
    $(".BREITBART-NEWS, .FOX-NEWS, .NATIONAL-REVIEW").show();
    $(".THE-WASHINGTON-POST, .MSNBC, .CNN").hide();
})
$("#add-foxnews-btn").on("click", function () {
    $(".FOX-NEWS").show();
    $(".MSNBC, .THE-WASHINGTON-POST, .NATIONAL-REVIEW, .CNN, .BREITBART-NEWS").hide();
})
$("#add-national-btn").on("click", function () {
    $(".NATIONAL-REVIEW").show();
    $(".MSNBC, .THE-WASHINGTON-POST, .BREITBART-NEWS, .CNN, .FOX-NEWS").hide();
})
$("#add-breitbart-btn").on("click", function () {
    $(".BREITBART-NEWS").show();
    $(".MSNBC, .THE-WASHINGTON-POST, .NATIONAL-REVIEW, .CNN, .FOX-NEWS").hide();
})
/* news / media portal ends here */

/* contact us script begins here */
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
        console.log("before " + userName)
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
/* contact us script ends here */
