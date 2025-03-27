var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var level = 0;
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

    $("#ultra").click(function () { // Ultra Mode Button
        gameMode = "ultra";
        startGame();
    });

    // Mute button click event
    $("#mute-btn").click(function () {
        isMuted = !isMuted;
        $("#mute-btn").text(isMuted ? "🔇 Sound Off" : "🔊 Sound On");
    });
});

// Function to start the game
function startGame() {
    $("#start-screen").hide(); // Hide difficulty selection
    $("#game-screen").show();  // Show game screen
    resetGame();

    if (!started) {
        $("#level-title").text("Level " + level);
        nextSequence();
        started = true;
    }
}

// User button click
$(".btn").on("click", function () {
    var userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);
    animatePress(userChosenColour);
    playSound(userChosenColour);
    checkAnswer(userClickedPattern.length - 1);
});

// Next sequence generation
function nextSequence() {
    userClickedPattern = [];
    level++;
    $("#level-title").text("Level " + level);

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
                }, i * 300); // Reduced delay
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

    // Save the ultra pattern as the game pattern
    gamePattern.push(...ultraPattern);

    ultraPattern.forEach((color, i) => {
        setTimeout(() => {
            animatePress(color);
            playSound(color);
        }, i * 500);
    });
}

// Play sound function (Respects mute state)
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
        $("#level-title").text("Game Over! Press Any Key to Restart");
        startOver();
    }
}

// Reset the game
function resetGame() {
    gamePattern = [];
    started = false;
    level = 0;
}

// Start over after game over
function startOver() {
    started = false;
    gamePattern = [];
    level = 0;

    $(document).one("keydown", function() {
        $("#level-title").text("Level " + level);
        nextSequence();
        started = true;
    });
}
