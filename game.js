var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var level = 0;
var started = false;
var hardMode = false; // Default is easy mode

$(document).ready(function () {
	// Handle difficulty selection
	$("#easy").click(function () {
		hardMode = false;
		startGame();
	});

	$("#hard").click(function () {
		hardMode = true;
		startGame();
	});
});

// Function to start the game
function startGame() {
	$("#start-screen").hide(); // Hide difficulty selection
	$("#game-screen").show();  // Show game screen
	resetGame();

	// Start the game immediately after difficulty selection
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

	var randomNumber = Math.floor(Math.random() * 4);
	var randomChosenColour = buttonColours[randomNumber];
	gamePattern.push(randomChosenColour);

	if (!hardMode) {
		// EASY MODE: Repeat full sequence
		for (let i = 0; i < gamePattern.length; i++) {
			setTimeout(() => {
				animatePress(gamePattern[i]);
				playSound(gamePattern[i]);
			}, i * 600);
		}
	} else {
		// HARD MODE: Show only the new color
		setTimeout(() => {
			animatePress(randomChosenColour);
			playSound(randomChosenColour);
		}, 600);
	}
}

// Play sound function
function playSound(name) {
	var audio = new Audio("sounds/" + name + ".mp3");
	audio.play();
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

	// Listen for key press to restart
	$(document).one("keydown", function() {
		$("#level-title").text("Level " + level);
		nextSequence();
		started = true;
	});
}
