$(document).ready(function () {
    var firebaseConfig = {
        apiKey: "AIzaSyBB9w4xCRN2eZqKbsB_TIO2bu_37LYkYYc",
        authDomain: "trainschedulinator.firebaseapp.com",
        databaseURL: "https://trainschedulinator.firebaseio.com",
        projectId: "trainschedulinator",
        storageBucket: "",
        messagingSenderId: "828737605413",
        appId: "1:828737605413:web:537e996e28e5dce3"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // capture database in variable
    var database = firebase.database();

    // onClick event variables
    var name;
    var destination;
    var firstTrain;
    var frequency = 0;

    $("#add-train").on("click", function () {
        event.preventDefault();
        //adding train info
        name = $("#train").val().trim();
        destination = $("#destination").val().trim();
        firstTrain = $("#first-train").val().trim();
        frequency = $("#frequency").val().trim();

        // pushing to firebase
        database.ref().push({
            name: name,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        $("form")[0].reset();
    });

    database.ref().on("child_added", function (childSnapshot) {
        var nextArrival;
        var minAway;

        var firstNewTrain = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");

        var timeDiff= moment().diff(moment(firstNewTrain), "minutes");
        var rmndr = timeDiff % childSnapshot.val().frequency;

        var minAway = childSnapshot.val().frequency - rmndr;

        var nextTrain = moment().add(minAway, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm");

        $("#add-row").append("<tr><td>" + childSnapshot.val().name +
            "</td><td>" + childSnapshot.val().destination +
            "</td><td>" + childSnapshot.val().frequency +
            "</td><td>" + nextTrain +
            "</td><td>" + minAway + "</td></tr>");


    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function (snapshot) {

        $("#name-display").html(snapshot.val().name);
        $("#email-display").html(snapshot.val().email);
        $("#age-display").html(snapshot.val().age);
        $("#comment-display").html(snapshot.val().comment);
    });
});