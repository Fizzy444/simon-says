var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var level = 0;
var started = false;
var gameMode = "easy";
var isMuted = false;

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

    // Restart button click event
    $("#restart-btn").click(function() {
        resetGame();
        startGamePlay();
    });
});

function startGame() {
    $("#start-screen").hide();
    $("#game-screen").show();
    $("#restart-btn").hide(); // Hide restart button initially
    resetGame();
    
    $("#level-title").html("Press Any Key to Start<br><span class='small-text'>Difficulty: " + gameMode + "</span>");
    
    // Listen for key press to start
    $(document).one("keydown", function() {
        startGamePlay();
    });
}

function startGamePlay() {
    if (!started) {
        $("#level-title").text("Level " + level);
        nextSequence();
        started = true;
    }
}

$(".btn").on("click", function () {
    if (!started) return;
    
    var userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);
    animatePress(userChosenColour);
    playSound(userChosenColour);
    checkAnswer(userClickedPattern.length - 1);
});

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
        audio.play().catch(e => console.log("Audio play failed:", e));
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
        gameOver();
    }
}

function gameOver() {
    playSound("wrong");
    $("body").addClass("game-over");
    
    // Enhanced game over message with restart button
    $("#level-title").html("Game Over!<br>Level Reached: " + (level-1) + 
                         "<br>Difficulty: " + gameMode);
    
    // Show the restart button
    $("#restart-btn").show().text("Play Again");
}

function resetGame() {
    started = false;
    gamePattern = [];
    level = 0;
    userClickedPattern = [];
    $("body").removeClass("game-over");
}