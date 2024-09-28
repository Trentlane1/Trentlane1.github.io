const canvas = document.getElementById("spaceInvadersCanvas");
const ctx = canvas.getContext("2d");

const playerWidth = 40;
const playerHeight = 20;
const playerSpeed = 5;
const bulletWidth = 5;
const bulletHeight = 10;
const bulletSpeed = 5;
const enemyWidth = 40;
const enemyHeight = 20;
const enemySpeed = 1;
const enemyDropHeight = 10;

let player = {
    x: canvas.width / 2 - playerWidth / 2,
    y: canvas.height - playerHeight - 10,
    width: playerWidth,
    height: playerHeight,
    dx: 0,
    bullets: []
};

let enemies = [];
let rows = 3;
let cols = 8;
let score = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.7;
    player.x = canvas.width / 2 - playerWidth / 2;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createEnemies() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let enemy = {
                x: col * (enemyWidth + 10),
                y: row * (enemyHeight + 10),
                width: enemyWidth,
                height: enemyHeight,
                alive: true
            };
            enemies.push(enemy);
        }
    }
}

function drawPlayer() {
    ctx.fillStyle = "green";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullets() {
    ctx.fillStyle = "yellow";
    player.bullets.forEach((bullet) => {
        ctx.fillRect(bullet.x, bullet.y, bulletWidth, bulletHeight);
    });
}

function drawEnemies() {
    ctx.fillStyle = "red";
    enemies.forEach((enemy) => {
        if (enemy.alive) {
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        }
    });
}

function movePlayer() {
    player.x += player.dx;
    if (player.x < 0) {
        player.x = 0;
    } else if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

function moveBullets() {
    player.bullets.forEach((bullet, index) => {
        bullet.y -= bulletSpeed;
        if (bullet.y + bulletHeight < 0) {
            player.bullets.splice(index, 1); // Remove bullet if it goes out of bounds
        }
    });
}

function moveEnemies() {
    let shouldDrop = false;
    enemies.forEach((enemy) => {
        if (enemy.alive) {
            enemy.x += enemySpeed;
            if (enemy.x + enemy.width >= canvas.width || enemy.x <= 0) {
                shouldDrop = true;
            }
        }
    });

    if (shouldDrop) {
        enemies.forEach((enemy) => {
            enemy.y += enemyDropHeight;
            enemy.x -= enemySpeed * 2;
        });
        enemySpeed *= -1; // Change direction
    }
}

function checkCollisions() {
    player.bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (
                enemy.alive &&
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bulletWidth > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bulletHeight > enemy.y
            ) {
                enemy.alive = false;
                player.bullets.splice(bulletIndex, 1);
                score += 10;
            }
        });
    });
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText("Score: " + score, 10, 20);
}

function gameOver() {
    for (let enemy of enemies) {
        if (enemy.alive && enemy.y + enemy.height >= player.y) {
            return true;
        }
    }
    return false;
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    movePlayer();
    moveBullets();
    moveEnemies();
    checkCollisions();

    drawPlayer();
    drawBullets();
    drawEnemies();
    drawScore();

    if (gameOver()) {
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2);
        return;
    }

    requestAnimationFrame(update);
}

// Event Listeners for keyboard
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        player.dx = -playerSpeed;
    } else if (event.key === "ArrowRight") {
        player.dx = playerSpeed;
    } else if (event.key === " ") {
        player.bullets.push({
            x: player.x + player.width / 2 - bulletWidth / 2,
            y: player.y,
            width: bulletWidth,
            height: bulletHeight
        });
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        player.dx = 0;
    }
});

// Touch control listeners
document.getElementById("leftButton").addEventListener("touchstart", () => {
    player.dx = -playerSpeed;
});

document.getElementById("rightButton").addEventListener("touchstart", () => {
    player.dx = playerSpeed;
});

document.getElementById("fireButton").addEventListener("touchstart", () => {
    player.bullets.push({
        x: player.x + player.width / 2 - bulletWidth / 2,
        y: player.y,
        width: bulletWidth,
        height: bulletHeight
    });
});

document.getElementById("leftButton").addEventListener("touchend", () => {
    player.dx = 0;
});

document.getElementById("rightButton").addEventListener("touchend", () => {
    player.dx = 0;
});

// Initialize the game
createEnemies();
update();
