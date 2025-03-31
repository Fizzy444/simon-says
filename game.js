var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var level = 0;
var score = 0;
var started = false;
var gameMode = "easy";
var isMuted = false;

$(document).ready(function () {
    $("#easy").click(function () {
        gameMode = "easy";
        startGame();
    });

    $("#hard").click(function () {
        gameMode = "hard";
        startGame();
    });

    $("#ultra").click(function () {
        gameMode = "ultra";
        startGame();
    });

    $("#mute-btn").click(function () {
        isMuted = !isMuted;
        $("#mute-btn").text(isMuted ? "🔇 Sound Off" : "🔊 Sound On");
    });

    $("#start-restart-btn").click(function() {
        if (!started) {
            $("#level-title").text("Level " + level);
            nextSequence();
            started = true;
            $(this).hide();
        }
    });

    $("#back-btn").click(function() {
        resetGame();
        $("#game-screen").hide();
        $("#start-screen").show();
        $("#start-restart-btn").text("Start Game").show();
        $("#level-title").text("Welcome to Simon!");
        $("#current-score").text("Score: 0");
    });

    $("#how-to-play-btn").click(function() {
        $("#how-to-play-easy, #how-to-play-hard, #how-to-play-ultra").hide();
        $("#how-to-play-modal").show();
        $("#how-to-play-" + gameMode).show();
    });

    $(".close").click(function() {
        $("#how-to-play-modal").hide();
    });

    $(window).click(function(event) {
        if (event.target == $("#how-to-play-modal")[0]) {
            $("#how-to-play-modal").hide();
        }
    });

    $(".btn").on("click", function () {
        var userChosenColour = $(this).attr("id");
        userClickedPattern.push(userChosenColour);
        animatePress(userChosenColour);
        playSound(userChosenColour);
        checkAnswer(userClickedPattern.length - 1);
    });
});

function startGame() {
    $("#start-screen").hide();  
    $("#game-screen").show();   
    $("#how-to-play-btn").show();
    $("#start-restart-btn").show().text("Start Game"); 
    $("#current-score").text("Score: 0");
    resetGame();
}


function nextSequence() {
    userClickedPattern = [];
    level++;
    score = level - 1;
    $("#level-title").text("Level " + level);
    $("#current-score").text("Score: " + score);

    if (gameMode === "ultra") {
        playUltraMode();
    } else {
        var randomNumber = Math.floor(Math.random() * 4);
        var randomChosenColour = buttonColours[randomNumber];
        gamePattern.push(randomChosenColour);

        if (gameMode === "easy") {
            for (let i = 0; i < gamePattern.length; i++) {
                setTimeout(() => {
                    animatePress(gamePattern[i]);
                    playSound(gamePattern[i]);
                }, i * 300);
            }
        } else if (gameMode === "hard") {
            setTimeout(() => {
                animatePress(randomChosenColour);
                playSound(randomChosenColour);
            }, 600);
        }
    }
}

function playUltraMode() {
    var numFlashes = Math.floor(Math.random() * 3) + 1;
    var ultraPattern = [];

    for (let i = 0; i < numFlashes; i++) {
        var randomColour = buttonColours[Math.floor(Math.random() * 4)];
        ultraPattern.push(randomColour);
    }

    gamePattern.push(...ultraPattern);

    ultraPattern.forEach((color, i) => {
        setTimeout(() => {
            animatePress(color);
            playSound(color);
        }, i * 500);
    });
}

function playSound(name) {
    if (!isMuted) {  
        var audio = new Audio("sounds/" + name + ".mp3");
        audio.play();
    }
}

function animatePress(currentColour) {
    $("#" + currentColour).addClass("pressed");
    setTimeout(function () {
        $("#" + currentColour).removeClass("pressed");
    }, 100);
}

function checkAnswer(currentLevel) {
    if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
        if (userClickedPattern.length === gamePattern.length) {
            setTimeout(nextSequence, 1000);
        }
    } else {
        playSound("wrong");
        $("body").addClass("game-over");
        setTimeout(() => {
            $("body").removeClass("game-over");
        }, 200);
        $("#level-title").html("Game Over!<br>Your Score: " + score);
        $("#start-restart-btn").text("Restart Game").show();
        startOver();
    }
}

function resetGame() {
    gamePattern = [];
    userClickedPattern = [];
    level = 0;
    score = 0;
    started = false;
    $("body").removeClass("game-over");
}

function startOver() {
    resetGame();
}
