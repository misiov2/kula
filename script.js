let balls = [];
let gravity = 0.2;
let boostCounter = 0;
const boostAmount = 10; // Amount of speed boost after every 5 bounces
let statsVisible = false;
let bounceCounter = 0;
let darkModeEnabled = false;
let fps = 0;
let unlimitedFPS = true;
let interval = 0;
let lastTime = 0;

function addBall() {
    let size = document.getElementById("ballSize").value;
    let speed = document.getElementById("ballSpeed").value;
    let color = document.getElementById("ballColor").value;
    let imageFile = document.getElementById("ballImage").files[0];
    let imageURL = imageFile ? URL.createObjectURL(imageFile) : null;
    
    createBall(size, speed, color, imageURL);
}

function createBall(size, speed, color, imageURL) {
    let ball = document.createElement("div");
    ball.className = "ball";
    ball.style.width = size + "px";
    ball.style.height = size + "px";
    ball.style.borderRadius = "50%";
    ball.style.backgroundColor = color;

    if (imageURL) {
        ball.style.backgroundImage = `url(${imageURL})`;
        ball.style.backgroundSize = "cover";
    }

    ball.style.position = "absolute";
    ball.style.left = Math.random() * (window.innerWidth - size) + "px";
    ball.style.top = Math.random() * (window.innerHeight - size) + "px";
    document.body.appendChild(ball);

    balls.push({ 
        element: ball, 
        speedX: Math.random() * 10 - 5, 
        speedY: parseFloat(speed), 
        bounceCount: 0,
        trail: null 
    });
}

function getRandomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}

function update(time) {
    if (unlimitedFPS || time - lastTime >= interval) {
        lastTime = time;

        for (let i = 0; i < balls.length; i++) {
            let ballA = balls[i];
            let currentTopA = parseFloat(ballA.element.style.top);
            let currentLeftA = parseFloat(ballA.element.style.left);
            let sizeA = parseFloat(ballA.element.style.height);

            if (ballA.trail) {
                ballA.trail.style.left = currentLeftA + "px";
                ballA.trail.style.top = currentTopA + "px";
            }

            for (let j = i + 1; j < balls.length; j++) {
                let ballB = balls[j];
                let currentTopB = parseFloat(ballB.element.style.top);
                let currentLeftB = parseFloat(ballB.element.style.left);
                let sizeB = parseFloat(ballB.element.style.height);

                let dx = currentLeftB - currentLeftA;
                let dy = currentTopB - currentTopA;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let minDistance = sizeA / 2 + sizeB / 2;

                if (distance < minDistance) {
                    // Kiedy kulki się zderzają, odpychają się od siebie
                    let angle = Math.atan2(dy, dx);
                    let targetX = currentLeftA + Math.cos(angle) * minDistance;
                    let targetY = currentTopA + Math.sin(angle) * minDistance;

                    let ax = (targetX - currentLeftA) * 0.1;
                    let ay = (targetY - currentTopA) * 0.1;

                    ballA.speedX -= ax;
                    ballA.speedY -= ay;
                    ballB.speedX += ax;
                    ballB.speedY += ay;
                }
            }

            if (currentTopA >= window.innerHeight - sizeA) {
                ballA.speedY *= -0.9; // Opór powietrza
                ballA.bounceCount++;
                bounceCounter++;
                if (ballA.bounceCount % 5 === 0) {
                    ballA.speedY -= boostAmount;
                }
            } else if (currentTopA <= 0) {
                ballA.speedY *= -1;
            } else {
                ballA.speedY += gravity;
            }

            if (currentLeftA <= 0 || currentLeftA >= window.innerWidth - sizeA) {
                ballA.speedX *= -1;
            }

            ballA.element.style.top = Math.min(Math.max(currentTopA + ballA.speedY, 0), window.innerHeight - sizeA) + "px";
            ballA.element.style.left = Math.min(Math.max(currentLeftA + ballA.speedX, 0), window.innerWidth - sizeA) + "px";
        }

        document.getElementById("bounceCount").innerText = bounceCounter;

        requestAnimationFrame(update);
    }
}

function toggleMenu() {
    let menu = document.getElementById("menu");
    menu.style.display = menu.style.display === "none" ? "block" : "none";
}

function toggleStats() {
    statsVisible = !statsVisible;
    let stats = document.getElementById("stats");
    stats.style.display = statsVisible ? "block" : "none";
}

function toggleDarkMode() {
    darkModeEnabled = !darkModeEnabled;
    document.body.classList.toggle("dark-mode", darkModeEnabled);
}

function clearBalls() {
    document.querySelectorAll('.ball').forEach(ball => ball.remove());
    balls = [];
    bounceCounter = 0;
    document.getElementById("bounceCount").innerText = bounceCounter;
}

document.getElementById("fpsSelect").addEventListener("change", function() {
    fps = parseInt(this.value, 10);
    interval = fps ? 1000 / fps : 0;
});

update();
