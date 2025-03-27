var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var level = 0;
var started = false;
var gameMode = "easy";
var isMuted = false;
var canClick = true; // Controls when user can interact

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

    // Mobile start - tap anywhere on game screen
    $("#game-screen").click(function() {
        if (!started && canClick) {
            startGamePlay();
        }
    });
});

function startGame() {
    $("#start-screen").hide();
    $("#game-screen").show();
    resetGame();
    canClick = true;
    
    // For mobile, show tap to start message
    if (isMobile()) {
        $("#level-title").html("Tap to Start<br><span class='small-text'>Difficulty: " + gameMode + "</span>");
    } else {
        $("#level-title").html("Press Any Key to Start<br><span class='small-text'>Difficulty: " + gameMode + "</span>");
    }
}

function startGamePlay() {
    if (!started) {
        $("#level-title").text("Level " + level);
        nextSequence();
        started = true;
    }
}

$(".btn").on("click", function () {
    if (!started || !canClick) return;
    
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
    canClick = false;
    playSound("wrong");
    $("body").addClass("game-over");
    
    // Enhanced game over message
    var gameOverMessage = "Game Over!<br>Level Reached: " + (level-1) + 
                         "<br>Difficulty: " + gameMode +
                         "<br><br>Tap to Restart";
    
    $("#level-title").html(gameOverMessage);
    
    // Delay before allowing restart
    setTimeout(function() {
        $("body").removeClass("game-over");
        canClick = true;
        
        // Set up restart listener
        $("#game-screen").one("click", function() {
            if (canClick) {
                resetGame();
                startGamePlay();
            }
        });
    }, 2000);
}

function resetGame() {
    started = false;
    gamePattern = [];
    level = 0;
    userClickedPattern = [];
}

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}