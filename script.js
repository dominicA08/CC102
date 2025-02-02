let targetNumber;
let attempts = 0;
let maxAttempts;
let health;
let playerName = '';
let points = 0;
const leaderboards = {
  easy: [],
  medium: [],
  hard: []
};

// Get DOM elements
const guessInput = document.getElementById('guess-input');
const submitButton = document.getElementById('submit-guess');
const message = document.getElementById('message');
const attemptsDisplay = document.getElementById('attempts');
const levelSelector = document.getElementById('level-selector');
const healthBar = document.getElementById('health-bar');
const gameOverOverlay = document.getElementById('game-over-overlay');
const playerNameInput = document.getElementById('player-name-input');
const startGameButton = document.getElementById('start-game');
const messageIcon = document.getElementById('message-icon');

// Get modal elements
const playerInfoModal = document.getElementById('player-info-modal');
const closeButton = document.querySelector('.close-button');
const playerIcon = document.getElementById('player-icon');

// Get message container elements
const messageContainer = document.getElementById('message-container');
const apologyMessage = document.getElementById('apology-message');
const messageCloseButton = messageContainer.querySelector('.close-button');

// Function to initialize the game
function initializeGame() {
  const level = levelSelector.value;
  if (level === 'easy') {
    targetNumber = Math.floor(Math.random() * 10) + 1;
    maxAttempts = 3;
  } else if (level === 'medium') {
    targetNumber = Math.floor(Math.random() * 50) + 1;
    maxAttempts = 4;
  } else {
    targetNumber = Math.floor(Math.random() * 100) + 1;
    maxAttempts = 5;
  }

  attempts = 0;
  health = maxAttempts;
  attemptsDisplay.textContent = `Attempts: ${attempts}`;
  message.textContent = '';
  guessInput.disabled = false;
  submitButton.disabled = false;
  gameOverOverlay.style.display = 'none'; // Hide the overlay

  updateHealthBar();
  updatePlayerInfo();
}

// Function to update the health bar
function updateHealthBar() {
  healthBar.innerHTML = '';
  for (let i = 0; i < maxAttempts; i++) {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    if (i >= health) {
      heart.classList.add('lost');
    }
    healthBar.appendChild(heart);
  }
}

// Function to display the game over message, correct answer, and GIF
function displayGameOver(targetNumber, attempts) {
  gameOverOverlay.style.display = 'flex';
  gameOverOverlay.innerHTML = `
    <div class="game-over-container">
      <img src="banana-cat-crying.gif" alt="Game Over GIF">
      <p>Game Over! The number was ${targetNumber}.</p>
      <p>You made ${attempts} attempts.</p>
      <button id="continue-button">Click here to continue</button>
    </div>
  `;
  document.getElementById('continue-button').addEventListener('click', initializeGame);
}

// Function to trigger confetti animation
function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

// Function to check the user's guess
function checkGuess() {
  const userGuess = parseInt(guessInput.value);

  if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
    message.textContent = 'Please enter a valid number between 1 and 100.';
    return;
  }

  attempts++;
  attemptsDisplay.textContent = `Attempts: ${attempts}`;

  if (userGuess < targetNumber) {
    message.textContent = 'Too low! Try again.';
  } else if (userGuess > targetNumber) {
    message.textContent = 'Too high! Try again.';
  } else {
    message.textContent = `Congratulations! You guessed the number in ${attempts} attempts.`;
    submitButton.disabled = true;
    guessInput.disabled = true;
    points++;
    updateLeaderboard();
    savePlayerData();
    triggerConfetti(); // Trigger confetti animation
    return;
  }

  health--;
  updateHealthBar();

  if (health === 0) {
    submitButton.disabled = true;
    guessInput.disabled = true;
    displayGameOver(targetNumber, attempts);
  }

  guessInput.value = ''; // Clear the input field
}

// Function to update the leaderboard
function updateLeaderboard() {
  const level = levelSelector.value;
  leaderboards[level].push({ name: playerName, points });
  leaderboards[level].sort((a, b) => b.points - a.points);
  console.log(leaderboards); // For demonstration purposes
}

// Function to save player data to localStorage
function savePlayerData() {
  const playerData = {
    name: playerName,
    points: points,
    leaderboards: leaderboards
  };
  localStorage.setItem('playerData', JSON.stringify(playerData));
  updatePlayerInfo();
}

// Function to load player data from localStorage
function loadPlayerData() {
  const playerData = JSON.parse(localStorage.getItem('playerData'));
  if (playerData) {
    playerName = playerData.name;
    points = playerData.points;
    Object.assign(leaderboards, playerData.leaderboards);
  }
}

// Function to update the player info display
function updatePlayerInfo() {
  document.getElementById('modal-player-name').textContent = playerName;
  document.getElementById('modal-easy-score').textContent = getScore('easy');
  document.getElementById('modal-medium-score').textContent = getScore('medium');
  document.getElementById('modal-hard-score').textContent = getScore('hard');
}

// Function to get the player's score for a specific level
function getScore(level) {
  const player = leaderboards[level].find(player => player.name === playerName);
  return player ? player.points : 0;
}

// Function to start the game
function startGame() {
  playerName = playerNameInput.value.trim();
  if (playerName === '') {
    alert('Please enter your name.');
    return;
  }
  document.getElementById('player-name-container').style.display = 'none';
  document.getElementById('game-container').style.display = 'block';
  initializeGame();
}

// Function to show the player info modal
function showPlayerInfoModal() {
  playerInfoModal.style.display = 'flex';
}

// Function to close the player info modal
function closePlayerInfoModal() {
  playerInfoModal.style.display = 'none';
}

// Function to display the apology message
function displayApologyMessage() {
  apologyMessage.innerHTML = `
    <p>GUESSING GAME GROUP</p>
    <p>CC 102</p>
    <p>FEBRUARY 2, 2025</p>
    <br>
    <p>Ma’am Aubrey Jane Tabor,</p>
    <p>AISAT</p>
    <br>
    <p>Dear Ma’am,</p>
    <br>
    <p>We sincerely apologize for not being able to develop our application game using C or C++ as initially required. We genuinely made every effort to work with these languages by watching tutorial videos, practicing coding sessions, and applying what we learned. However, despite our best attempts, we encountered multiple issues, including compatibility problems on our devices and laptops, which prevented us from successfully executing our project.</p>
    <br>
    <p>Due to these difficulties, we decided to proceed with HTML, CSS, and JavaScript instead, as they allowed us to create an interactive UI and ensure that the application functioned properly. We understand that this was not the original requirement, and we regret any inconvenience this decision may have caused.</p>
    <br>
    <p>To support our explanation, we have included documentation in our project folder detailing the challenges we faced, along with proof of our attempts with C and C++. We truly appreciate your understanding and guidance and are open to any discussions regarding our project.</p>
    <br>
    <p>Once again, we sincerely apologize and hope for your consideration.</p>
    <br>
    <p>Sincerely,</p>
    <p>Onding, Christian</p>
    <p>Josue, John Cee</p>
    <p>Atis, Pronimar</p>
    <p>Solis, Dustin Drae</p>
  `;
  messageContainer.style.display = 'flex';
}

// Function to close the message container
function closeMessageContainer() {
  messageContainer.style.display = 'none';
}

// Function to update the guide text based on the selected level
function updateGuideText() {
  const level = levelSelector.value;
  const guideText = document.getElementById('guide-text');
  if (level === 'easy') {
    guideText.textContent = 'Guess a number between 1 and 10:';
  } else if (level === 'medium') {
    guideText.textContent = 'Guess a number between 1 and 50:';
  } else {
    guideText.textContent = 'Guess a number between 1 and 100:';
  }
}

// Event listener for the player icon
playerIcon.addEventListener('click', showPlayerInfoModal);

// Event listener for the close button
closeButton.addEventListener('click', closePlayerInfoModal);

// Event listener for clicks outside the modal
window.addEventListener('click', function(event) {
  if (event.target === playerInfoModal) {
    closePlayerInfoModal();
  }
});

// Event listener for the submit button
submitButton.addEventListener('click', checkGuess);

// Event listener for the Enter key
guessInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    checkGuess();
  }
});

// Event listener for the level selector
levelSelector.addEventListener('change', () => {
  initializeGame();
  updateGuideText();
});

// Event listener for the start game button
startGameButton.addEventListener('click', startGame);

// Event listener for the message icon
messageIcon.addEventListener('click', displayApologyMessage);

// Event listener for the close button in the message container
messageCloseButton.addEventListener('click', closeMessageContainer);

// Event listener for clicks outside the message container
window.addEventListener('click', function(event) {
  if (event.target === messageContainer) {
    closeMessageContainer();
  }
});

// Load player data on page load
loadPlayerData();
document.getElementById('game-container').style.display = 'none';
updateGuideText(); // Update guide text on page load