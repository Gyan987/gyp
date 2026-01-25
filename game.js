// Game Constants
const GAME_CONFIG = {
    lanes: 3,
    laneWidth: 150,
    playerSpeed: 8,
    obstacleSpeed: 8,
    coinSpeed: 8,
    jumpHeight: 150,
    jumpDuration: 500,
    slideDuration: 500,
    obstacleSpawnRate: 0.015,
    coinSpawnRate: 0.03,
    speedIncrease: 0.0001
};

// Game State
const gameState = {
    isRunning: false,
    score: 0,
    distance: 0,
    coins: 0,
    currentLane: 1, // 0 = left, 1 = center, 2 = right
    isJumping: false,
    isSliding: false,
    jumpStartTime: 0,
    slideStartTime: 0,
    playerY: 0,
    obstacles: [],
    coinObjects: [],
    gameSpeed: GAME_CONFIG.obstacleSpeed,
    animationFrame: null
};

// Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    const container = document.getElementById('gameContainer');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Game Classes
class Obstacle {
    constructor(lane, type = 'barrier') {
        this.lane = lane;
        this.type = type; // 'barrier', 'gap', 'low'
        this.y = -100;
        this.width = GAME_CONFIG.laneWidth - 20;
        this.height = type === 'low' ? 80 : 150;
        this.passed = false;
    }

    update() {
        this.y += gameState.gameSpeed;
    }

    draw() {
        const x = this.getLaneX() + 10;
        
        ctx.save();
        
        // Draw perspective effect
        const perspectiveScale = 1 + (this.y / canvas.height) * 0.5;
        const drawWidth = this.width * perspectiveScale;
        const drawHeight = this.height * perspectiveScale;
        
        if (this.type === 'barrier') {
            // Red barrier
            ctx.fillStyle = '#e74c3c';
            ctx.shadowColor = '#c0392b';
            ctx.shadowBlur = 10;
            ctx.fillRect(x - (drawWidth - this.width) / 2, this.y, drawWidth, drawHeight);
            
            // Add stripes
            ctx.fillStyle = '#c0392b';
            for (let i = 0; i < 3; i++) {
                ctx.fillRect(
                    x - (drawWidth - this.width) / 2,
                    this.y + i * (drawHeight / 3),
                    drawWidth,
                    drawHeight / 6
                );
            }
        } else if (this.type === 'low') {
            // Yellow low obstacle
            ctx.fillStyle = '#f39c12';
            ctx.shadowColor = '#e67e22';
            ctx.shadowBlur = 10;
            ctx.fillRect(x - (drawWidth - this.width) / 2, this.y, drawWidth, drawHeight);
            
            // Add warning stripes
            ctx.fillStyle = '#000';
            for (let i = 0; i < drawWidth; i += 20) {
                ctx.fillRect(x - (drawWidth - this.width) / 2 + i, this.y, 10, drawHeight);
            }
        }
        
        ctx.restore();
    }

    getLaneX() {
        return (canvas.width / 2) - (GAME_CONFIG.laneWidth * 1.5) + (this.lane * GAME_CONFIG.laneWidth);
    }

    checkCollision(playerLane, playerY, isSliding) {
        if (this.lane !== playerLane) return false;
        
        const playerTop = playerY;
        const playerBottom = playerY + 100;
        const obstacleTop = this.y;
        const obstacleBottom = this.y + this.height;
        
        // Check if player is in range of obstacle
        if (playerBottom > obstacleTop && playerTop < obstacleBottom) {
            // If low obstacle and sliding, no collision
            if (this.type === 'low' && isSliding) {
                return false;
            }
            // If barrier and jumping high enough, no collision
            if (this.type === 'barrier' && playerY < -100) {
                return false;
            }
            return true;
        }
        
        return false;
    }
}

class Coin {
    constructor(lane, height = 'mid') {
        this.lane = lane;
        this.height = height; // 'ground', 'mid', 'high'
        this.y = -100;
        this.width = 30;
        this.collected = false;
        
        // Set Y position based on height
        if (height === 'high') {
            this.yOffset = -120;
        } else if (height === 'mid') {
            this.yOffset = -60;
        } else {
            this.yOffset = 0;
        }
    }

    update() {
        this.y += gameState.coinSpeed;
    }

    draw() {
        if (this.collected) return;
        
        const x = this.getLaneX();
        const y = this.y + this.yOffset;
        
        ctx.save();
        
        // Draw perspective effect
        const perspectiveScale = 1 + (this.y / canvas.height) * 0.3;
        const radius = 15 * perspectiveScale;
        
        // Draw coin
        ctx.beginPath();
        ctx.arc(x + GAME_CONFIG.laneWidth / 2, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#f1c40f';
        ctx.shadowColor = '#f39c12';
        ctx.shadowBlur = 15;
        ctx.fill();
        
        // Add shine effect
        ctx.beginPath();
        ctx.arc(x + GAME_CONFIG.laneWidth / 2 - 5, y - 5, radius / 3, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        
        ctx.restore();
    }

    getLaneX() {
        return (canvas.width / 2) - (GAME_CONFIG.laneWidth * 1.5) + (this.lane * GAME_CONFIG.laneWidth);
    }

    checkCollection(playerLane, playerY) {
        if (this.collected || this.lane !== playerLane) return false;
        
        const coinY = this.y + this.yOffset;
        const playerTop = playerY;
        const playerBottom = playerY + 100;
        
        // Check if player is in range of coin
        if (playerBottom > coinY - 20 && playerTop < coinY + 20) {
            this.collected = true;
            return true;
        }
        
        return false;
    }
}

// Game Functions
function initGame() {
    gameState.isRunning = false;
    gameState.score = 0;
    gameState.distance = 0;
    gameState.coins = 0;
    gameState.currentLane = 1;
    gameState.isJumping = false;
    gameState.isSliding = false;
    gameState.playerY = 0;
    gameState.obstacles = [];
    gameState.coinObjects = [];
    gameState.gameSpeed = GAME_CONFIG.obstacleSpeed;
}

function startGame() {
    initGame();
    gameState.isRunning = true;
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameOverScreen').classList.add('hidden');
    gameLoop();
}

function gameOver() {
    gameState.isRunning = false;
    
    // Update final scores
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('finalDistance').textContent = gameState.distance;
    document.getElementById('finalCoins').textContent = gameState.coins;
    
    document.getElementById('gameOverScreen').classList.remove('hidden');
    
    if (gameState.animationFrame) {
        cancelAnimationFrame(gameState.animationFrame);
    }
}

function updateScore() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('distance').textContent = gameState.distance;
    document.getElementById('coins').textContent = gameState.coins;
}

function spawnObstacle() {
    if (Math.random() < GAME_CONFIG.obstacleSpawnRate) {
        const lane = Math.floor(Math.random() * GAME_CONFIG.lanes);
        const type = Math.random() > 0.7 ? 'low' : 'barrier';
        gameState.obstacles.push(new Obstacle(lane, type));
    }
}

function spawnCoin() {
    if (Math.random() < GAME_CONFIG.coinSpawnRate) {
        const lane = Math.floor(Math.random() * GAME_CONFIG.lanes);
        const heights = ['ground', 'mid', 'high'];
        const height = heights[Math.floor(Math.random() * heights.length)];
        gameState.coinObjects.push(new Coin(lane, height));
    }
}

function updatePlayer() {
    const now = Date.now();
    
    // Update jumping
    if (gameState.isJumping) {
        const elapsed = now - gameState.jumpStartTime;
        if (elapsed < GAME_CONFIG.jumpDuration) {
            // Parabolic jump
            const progress = elapsed / GAME_CONFIG.jumpDuration;
            gameState.playerY = -GAME_CONFIG.jumpHeight * Math.sin(progress * Math.PI);
        } else {
            gameState.isJumping = false;
            gameState.playerY = 0;
        }
    }
    
    // Update sliding
    if (gameState.isSliding) {
        const elapsed = now - gameState.slideStartTime;
        if (elapsed >= GAME_CONFIG.slideDuration) {
            gameState.isSliding = false;
        }
    }
}

function drawPlayer() {
    const laneX = (canvas.width / 2) - (GAME_CONFIG.laneWidth * 1.5) + (gameState.currentLane * GAME_CONFIG.laneWidth);
    const playerX = laneX + GAME_CONFIG.laneWidth / 2;
    const playerBaseY = canvas.height - 200;
    const playerY = playerBaseY + gameState.playerY;
    
    ctx.save();
    
    if (gameState.isSliding) {
        // Draw sliding player
        ctx.fillStyle = '#3498db';
        ctx.shadowColor = '#2980b9';
        ctx.shadowBlur = 10;
        ctx.fillRect(playerX - 25, playerY + 50, 50, 30);
        
        // Head
        ctx.beginPath();
        ctx.arc(playerX, playerY + 50, 20, 0, Math.PI * 2);
        ctx.fill();
    } else {
        // Draw running player
        ctx.fillStyle = '#3498db';
        ctx.shadowColor = '#2980b9';
        ctx.shadowBlur = 10;
        
        // Body
        ctx.fillRect(playerX - 20, playerY + 30, 40, 60);
        
        // Head
        ctx.beginPath();
        ctx.arc(playerX, playerY + 15, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Legs (animated)
        const legOffset = Math.sin(Date.now() / 100) * 10;
        ctx.fillRect(playerX - 15, playerY + 90, 12, 30);
        ctx.fillRect(playerX + 3, playerY + 90, 12, 30 + legOffset);
    }
    
    ctx.restore();
}

function drawPath() {
    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#2c3e50');
    gradient.addColorStop(1, '#34495e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw lanes with perspective
    ctx.save();
    
    const centerX = canvas.width / 2;
    const laneWidth = GAME_CONFIG.laneWidth;
    
    // Draw path
    ctx.fillStyle = '#7f8c8d';
    ctx.beginPath();
    ctx.moveTo(centerX - laneWidth * 2, 0);
    ctx.lineTo(centerX - laneWidth * 1.5, canvas.height);
    ctx.lineTo(centerX + laneWidth * 1.5, canvas.height);
    ctx.lineTo(centerX + laneWidth * 2, 0);
    ctx.closePath();
    ctx.fill();
    
    // Draw lane dividers
    ctx.strokeStyle = '#ecf0f1';
    ctx.lineWidth = 3;
    ctx.setLineDash([20, 10]);
    
    for (let i = 1; i < GAME_CONFIG.lanes; i++) {
        ctx.beginPath();
        const topX = centerX - laneWidth + (i * (laneWidth * 2) / GAME_CONFIG.lanes);
        const bottomX = centerX - laneWidth * 1.5 + (i * laneWidth);
        ctx.moveTo(topX, 0);
        ctx.lineTo(bottomX, canvas.height);
        ctx.stroke();
    }
    
    ctx.restore();
}

function gameLoop() {
    if (!gameState.isRunning) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    drawPath();
    
    // Spawn objects
    spawnObstacle();
    spawnCoin();
    
    // Update player
    updatePlayer();
    
    // Update and draw obstacles
    for (let i = gameState.obstacles.length - 1; i >= 0; i--) {
        const obstacle = gameState.obstacles[i];
        obstacle.update();
        obstacle.draw();
        
        // Check collision
        if (obstacle.checkCollision(gameState.currentLane, canvas.height - 200 + gameState.playerY, gameState.isSliding)) {
            gameOver();
            return;
        }
        
        // Award points for passing obstacle
        if (!obstacle.passed && obstacle.y > canvas.height - 200) {
            obstacle.passed = true;
            gameState.score += 10;
        }
        
        // Remove off-screen obstacles
        if (obstacle.y > canvas.height) {
            gameState.obstacles.splice(i, 1);
        }
    }
    
    // Update and draw coins
    for (let i = gameState.coinObjects.length - 1; i >= 0; i--) {
        const coin = gameState.coinObjects[i];
        coin.update();
        coin.draw();
        
        // Check collection
        if (coin.checkCollection(gameState.currentLane, canvas.height - 200 + gameState.playerY)) {
            gameState.coins++;
            gameState.score += 5;
        }
        
        // Remove off-screen coins
        if (coin.y > canvas.height) {
            gameState.coinObjects.splice(i, 1);
        }
    }
    
    // Draw player
    drawPlayer();
    
    // Update game state
    gameState.distance += Math.floor(gameState.gameSpeed / 10);
    gameState.score += 1;
    gameState.gameSpeed += GAME_CONFIG.speedIncrease;
    
    // Update UI
    updateScore();
    
    // Continue game loop
    gameState.animationFrame = requestAnimationFrame(gameLoop);
}

// Input Handling
function moveLeft() {
    if (gameState.currentLane > 0 && !gameState.isJumping) {
        gameState.currentLane--;
    }
}

function moveRight() {
    if (gameState.currentLane < GAME_CONFIG.lanes - 1 && !gameState.isJumping) {
        gameState.currentLane++;
    }
}

function jump() {
    if (!gameState.isJumping && !gameState.isSliding) {
        gameState.isJumping = true;
        gameState.jumpStartTime = Date.now();
    }
}

function slide() {
    if (!gameState.isSliding && !gameState.isJumping) {
        gameState.isSliding = true;
        gameState.slideStartTime = Date.now();
    }
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (!gameState.isRunning) return;
    
    switch (e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            moveLeft();
            break;
        case 'ArrowRight':
            e.preventDefault();
            moveRight();
            break;
        case 'ArrowUp':
            e.preventDefault();
            jump();
            break;
        case 'ArrowDown':
            e.preventDefault();
            slide();
            break;
    }
});

// Touch/Mobile controls
document.querySelectorAll('.control-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (!gameState.isRunning) return;
        
        const action = btn.dataset.action;
        switch (action) {
            case 'left':
                moveLeft();
                break;
            case 'right':
                moveRight();
                break;
            case 'jump':
                jump();
                break;
            case 'slide':
                slide();
                break;
        }
    });
});

// Swipe controls for mobile
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

canvas.addEventListener('touchend', (e) => {
    if (!gameState.isRunning) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Determine swipe direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 50) {
            moveRight();
        } else if (deltaX < -50) {
            moveLeft();
        }
    } else {
        // Vertical swipe
        if (deltaY < -50) {
            jump();
        } else if (deltaY > 50) {
            slide();
        }
    }
});

// Button event listeners
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('restartButton').addEventListener('click', startGame);

// Initialize
initGame();
updateScore();
