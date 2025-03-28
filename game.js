var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var level = 0;
var score = 0;
var started = false;
var gameMode = "easy"; // Default mode
var isMuted = false; // Default: Sound ON

$(document).ready(function () {
    // Handle difficulty selection
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

    // Mute button click event
    $("#mute-btn").click(function () {
        isMuted = !isMuted;
        $("#mute-btn").text(isMuted ? "🔇 Sound Off" : "🔊 Sound On");
    });

    // Start/Restart button click event
    $("#start-restart-btn").click(function() {
        if (!started) {
            $("#level-title").text("Level " + level);
            nextSequence();
            started = true;
            $(this).hide();
        }
    });

    // Back button click event
    $("#back-btn").click(function() {
        resetGame();
        $("#game-screen").hide();
        $("#start-screen").show();
        $("#start-restart-btn").text("Start Game").show();
        $("#level-title").text("Welcome to Simon!");
        $("#current-score").text("Score: 0");
    });

    // User button clicks
    $(".btn").on("click", function () {
        var userChosenColour = $(this).attr("id");
        userClickedPattern.push(userChosenColour);
        animatePress(userChosenColour);
        playSound(userChosenColour);
        checkAnswer(userClickedPattern.length - 1);
    });
});

// Function to start the game
function startGame() {
    $("#start-screen").hide();
    $("#game-screen").show();
    $("#start-restart-btn").show().text("Start Game");
    $("#current-score").text("Score: 0");
    resetGame();
}

// Next sequence generation
function nextSequence() {
    userClickedPattern = [];
    level++;
    score = level - 1; // Score is always one less than level
    $("#level-title").text("Level " + level);
    $("#current-score").text("Score: " + score);

    if (gameMode === "ultra") {
        playUltraMode();
    } else {
        var randomNumber = Math.floor(Math.random() * 4);
        var randomChosenColour = buttonColours[randomNumber];
        gamePattern.push(randomChosenColour);

        if (gameMode === "easy") {
            // EASY MODE: Repeat full sequence with reduced delay
            for (let i = 0; i < gamePattern.length; i++) {
                setTimeout(() => {
                    animatePress(gamePattern[i]);
                    playSound(gamePattern[i]);
                }, i * 300);
            }
        } else if (gameMode === "hard") {
            // HARD MODE: Show only the new color
            setTimeout(() => {
                animatePress(randomChosenColour);
                playSound(randomChosenColour);
            }, 600);
        }
    }
}

// Ultra Mode Logic
function playUltraMode() {
    var numFlashes = Math.floor(Math.random() * 3) + 1; // 1 to 3 colors
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

// Play sound function
function playSound(name) {
    if (!isMuted) {  
        var audio = new Audio("sounds/" + name + ".mp3");
        audio.play();
    }
}

// Animate button press
function animatePress(currentColour) {
    $("#" + currentColour).addClass("pressed");
    setTimeout(function () {
        $("#" + currentColour).removeClass("pressed");
    }, 100);
}

// Check user answer
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

// Reset the game
function resetGame() {
    gamePattern = [];
    userClickedPattern = [];
    level = 0;
    score = 0;
    started = false;
    $("body").removeClass("game-over");
}

// Start over after game over
function startOver() {
    resetGame();
}