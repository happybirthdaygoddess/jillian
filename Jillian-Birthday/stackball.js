const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const scoreElement = document.getElementById("score");
const finalScoreElement = document.getElementById("finalScore");

const gameOverScreen = document.getElementById("gameOver");
const winScreen = document.getElementById("winScreen");

const restartBtn = document.getElementById("restartBtn");
const playAgainBtn = document.getElementById("playAgainBtn");

const breakSound = document.getElementById("breakSound");
const loseSound = document.getElementById("loseSound");
const winSound = document.getElementById("winSound");

let score = 0;

let gameRunning = true;
let gameWon = false;
let smashing = false;

let cameraY = 0;

let rotation = 0;
let targetRotation = 0;

let mouseDown = false;
let lastPointerX = 0;

const gravity = 0.55;
const bounceForce = -13;

const towerX = () => canvas.width / 2;
const towerY = () => canvas.height / 2;

const towerRadius = 135;
const platformThickness = 22;
const platformGap = 80;
const totalPlatforms = 26;

const colors = [
    "#ff7eb9",
    "#ff92c7",
    "#ffa7d4",
    "#ffc2e3"
];

const dangerColor = "#2c2c2c";

const ball = {
    x: 0,
    y: 0,
    radius: 18,
    velocity: 0,
    color: "#ffffff",
    glow: "#ff5ca8",
    fire: false,
    streak: 0
};

ball.x = towerX();
ball.y = towerY() - 220;

let platforms = [];
let particles = [];

class Platform {

    constructor(y) {

        this.y = y;

        this.rotation = Math.random() * Math.PI * 2;

        this.sections = [];

        this.destroyed = false;

        this.createSections();

    }

    createSections() {

        const pieces = 12;

        const gap = Math.floor(Math.random() * pieces);

        const danger = Math.floor(Math.random() * pieces);

        for (let i = 0; i < pieces; i++) {

            if (i === gap) {

                this.sections.push({
                    type: "gap"
                });

            } else {

                this.sections.push({

                    type: i === danger ? "danger" : "normal",

                    color: colors[Math.floor(Math.random() * colors.length)]

                });

            }

        }

    }

}

function createTower() {

    platforms = [];

    for (let i = 0; i < totalPlatforms; i++) {

        const p = new Platform(i * platformGap);

        platforms.push(p);

    }

}

createTower();

function drawBall() {

    ctx.save();

    ctx.shadowBlur = 30;
    ctx.shadowColor = ball.glow;

    if (ball.fire) {

        ctx.shadowBlur = 55;
        ctx.shadowColor = "#ff2e84";

    }

    ctx.beginPath();

    ctx.fillStyle = ball.color;

    ctx.arc(
        ball.x,
        ball.y,
        ball.radius,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();

}

function drawPlatforms() {

    for (const platform of platforms) {

        if (platform.destroyed)
            continue;

        const screenY = towerY() - platform.y + cameraY;

        if (screenY < -100 || screenY > canvas.height + 100)
            continue;

        const step = (Math.PI * 2) / platform.sections.length;

        for (let i = 0; i < platform.sections.length; i++) {

            const section = platform.sections[i];

            if (section.type === "gap")
                continue;

            const start = platform.rotation + rotation + i * step;
            const end = start + step * 0.95;

            ctx.beginPath();

            ctx.arc(
                towerX(),
                screenY,
                towerRadius,
                start,
                end
            );

            ctx.arc(
                towerX(),
                screenY,
                towerRadius - 48,
                end,
                start,
                true
            );

            ctx.closePath();

            if (section.type === "danger") {

                ctx.fillStyle = dangerColor;

            } else {

                ctx.fillStyle = section.color;

            }

            ctx.shadowBlur = 12;
            ctx.shadowColor = "rgba(0,0,0,.18)";
            ctx.fill();

        }

        ctx.beginPath();

        ctx.fillStyle = "#f7c0dc";

        ctx.arc(
            towerX(),
            screenY,
            18,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}

class Particle {

    constructor(x, y, color) {

        this.x = x;
        this.y = y;

        this.vx = (Math.random() - 0.5) * 10;
        this.vy = (Math.random() - 0.5) * 10;

        this.radius = Math.random() * 5 + 2;

        this.life = 1;

        this.color = color;

    }

    update() {

        this.x += this.vx;
        this.y += this.vy;

        this.vy += 0.18;

        this.life -= 0.02;

    }

    draw() {

        ctx.globalAlpha = this.life;

        ctx.beginPath();

        ctx.fillStyle = this.color;

        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.globalAlpha = 1;

    }

}

function spawnParticles(x, y, color, amount = 18) {

    for (let i = 0; i < amount; i++) {

        particles.push(
            new Particle(x, y, color)
        );

    }

}

function updateParticles() {

    for (let i = particles.length - 1; i >= 0; i--) {

        particles[i].update();

        if (particles[i].life <= 0) {

            particles.splice(i, 1);

        }

    }

}

function drawParticles() {

    for (const particle of particles) {

        particle.draw();

    }

}

function updateBall() {

    if (!gameRunning)
        return;

    ball.velocity += gravity;

    if (ball.velocity > 20)
        ball.velocity = 20;

    ball.y += ball.velocity;

    const centerLine = towerY() - 40;

    if (ball.y > centerLine) {

        ball.y = centerLine;

        ball.velocity = bounceForce;

    }

    cameraY += 4;

    if (mouseDown) {

        ball.streak++;

    } else {

        ball.streak = 0;

    }

    if (ball.streak > 18) {

        ball.fire = true;

    } else {

        ball.fire = false;

    }

}

function checkCollision() {

    if (!gameRunning)
        return;

    for (const platform of platforms) {

        if (platform.destroyed)
            continue;

        const screenY = towerY() - platform.y + cameraY;

        if (Math.abs(ball.y - screenY) > 16)
            continue;

        const dx = ball.x - towerX();
        const dy = ball.y - screenY;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < towerRadius - 48)
            continue;

        if (distance > towerRadius)
            continue;

        let angle = Math.atan2(dy, dx);

        if (angle < 0)
            angle += Math.PI * 2;

        angle -= rotation + platform.rotation;

        while (angle < 0)
            angle += Math.PI * 2;

        angle %= Math.PI * 2;

        const step = (Math.PI * 2) / platform.sections.length;

        const index = Math.floor(angle / step);

        const section = platform.sections[index];

        if (!section)
            continue;

        if (section.type === "gap")
            continue;

        if (ball.fire) {

            platform.destroyed = true;

            score += 10;

            scoreElement.textContent = score;

            spawnParticles(
                towerX(),
                screenY,
                section.color,
                35
            );

            if (breakSound)
                breakSound.currentTime = 0;

            if (breakSound)
                breakSound.play();

            continue;

        }

        if (section.type === "danger") {

            gameRunning = false;

            if (loseSound) {

                loseSound.currentTime = 0;
                loseSound.play();

            }

            finalScoreElement.textContent = score;

            gameOverScreen.classList.remove("hidden");

            return;

        }

        platform.destroyed = true;

        score += 10;

        scoreElement.textContent = score;

        spawnParticles(
            towerX(),
            screenY,
            section.color,
            22
        );

        if (breakSound) {

            breakSound.currentTime = 0;
            breakSound.play();

        }

    }

}

function updateRotation() {

    rotation += (targetRotation - rotation) * 0.18;

}

function pointerDown(x) {

    mouseDown = true;

    lastPointerX = x;

}

function pointerMove(x) {

    if (!mouseDown)
        return;

    const dx = x - lastPointerX;

    targetRotation += dx * 0.01;

    lastPointerX = x;

}

function pointerUp() {

    mouseDown = false;

}

canvas.addEventListener("mousedown", e => {

    pointerDown(e.clientX);

});

window.addEventListener("mousemove", e => {

    pointerMove(e.clientX);

});

window.addEventListener("mouseup", () => {

    pointerUp();

});

canvas.addEventListener("touchstart", e => {

    pointerDown(e.touches[0].clientX);

}, {
    passive: true
});

window.addEventListener("touchmove", e => {

    pointerMove(e.touches[0].clientX);

}, {
    passive: true
});

window.addEventListener("touchend", () => {

    pointerUp();

});

function checkWin() {

    if (gameWon)
        return;

    let remaining = 0;

    for (const platform of platforms) {

        if (!platform.destroyed)
            remaining++;

    }

    if (remaining > 0)
        return;

    gameWon = true;

    gameRunning = false;

    finalScoreElement.textContent = score;

    if (winSound) {

        winSound.currentTime = 0;
        winSound.play();

    }

    winScreen.classList.remove("hidden");

}

function resetGame() {

    score = 0;

    scoreElement.textContent = "0";

    gameRunning = true;

    gameWon = false;

    mouseDown = false;

    rotation = 0;

    targetRotation = 0;

    cameraY = 0;

    particles = [];

    ball.velocity = 0;

    ball.streak = 0;

    ball.fire = false;

    ball.x = towerX();

    ball.y = towerY() - 220;

    gameOverScreen.classList.add("hidden");

    winScreen.classList.add("hidden");

    createTower();

}

function drawTowerShadow() {

    ctx.save();

    ctx.beginPath();

    ctx.fillStyle = "rgba(0,0,0,.12)";

    ctx.ellipse(
        towerX(),
        towerY() + 250,
        towerRadius + 25,
        30,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();

}

function drawCenterPole() {

    ctx.save();

    ctx.fillStyle = "#ffe6f2";

    ctx.fillRect(
        towerX() - 12,
        0,
        24,
        canvas.height
    );

    ctx.restore();

}

function drawFireEffect() {

    if (!ball.fire)
        return;

    for (let i = 0; i < 8; i++) {

        ctx.beginPath();

        ctx.fillStyle = `rgba(255,${120 + Math.random() * 80},180,.45)`;

        ctx.arc(
            ball.x + (Math.random() - 0.5) * 18,
            ball.y + 12 + Math.random() * 20,
            Math.random() * 8 + 4,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}

function animateScore() {

    scoreElement.classList.add("score-pop");

    setTimeout(() => {

        scoreElement.classList.remove("score-pop");

    }, 150);

}

function updateCamera() {

    const target = ball.y - (towerY() - 40);

    cameraY -= target * 0.12;

}

function drawBackgroundGlow() {

    const glow = ctx.createRadialGradient(

        towerX(),
        towerY(),

        50,

        towerX(),
        towerY(),

        450

    );

    glow.addColorStop(0, "rgba(255,255,255,.45)");
    glow.addColorStop(.5, "rgba(255,180,220,.18)");
    glow.addColorStop(1, "rgba(255,180,220,0)");

    ctx.fillStyle = glow;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

}

function render() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawBackgroundGlow();

    drawTowerShadow();

    drawCenterPole();

    drawPlatforms();

    drawParticles();

    drawFireEffect();

    drawBall();

}

function update() {

    if (!gameRunning)
        return;

    updateRotation();

    updateBall();

    updateCamera();

    checkCollision();

    updateParticles();

    checkWin();

}

function gameLoop() {

    update();

    render();

    requestAnimationFrame(gameLoop);

}

restartBtn.addEventListener("click", () => {

    resetGame();

});

playAgainBtn.addEventListener("click", () => {

    resetGame();

});

window.addEventListener("keydown", e => {

    if (e.code === "Space") {

        mouseDown = true;

    }

});

window.addEventListener("keyup", e => {

    if (e.code === "Space") {

        mouseDown = false;

    }

});

document.addEventListener("visibilitychange", () => {

    if (document.hidden) {

        mouseDown = false;

    }

});

function randomizeTowerColors() {

    for (const platform of platforms) {

        for (const section of platform.sections) {

            if (section.type === "normal") {

                section.color =
                    colors[Math.floor(Math.random() * colors.length)];

            }

        }

    }

}

randomizeTowerColors();

gameLoop();

