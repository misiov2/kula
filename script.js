let balls = [];
let gravity = 0.2;
let boostCounter = 0;
const boostAmount = 10;
let statsVisible = false;
let bounceCounter = 0;
let isDragging = false;
let offset = { x: 0, y: 0 };

// Add ball to the screen
function addBall() {
    let size = document.getElementById("ballSize").value;
    let speed = document.getElementById("ballSpeed").value;
    let color = document.getElementById("ballColor").value;
    createBall(size, speed, color);
}

// Create a ball element
function createBall(size, speed, color) {
    let ball = document.createElement("div");
    ball.className = "ball";
    ball.style.width = size + "px";
    ball.style.height = size + "px";
    ball.style.backgroundColor = color;
    ball.style.left = Math.random() * (window.innerWidth - size) + "px";
    ball.style.top = Math.random() * (window.innerHeight - size) + "px";
    document.body.appendChild(ball);
    balls.push({ element: ball, speedX: Math.random() * 10 - 5, speedY: parseFloat(speed), bounceCount: 0 });
    updateBallCount();
}

// Update ball count display
function updateBallCount() {
    document.getElementById("ballCount").innerText = balls.length;
}

// Get a random color for background
function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

// Update the position of the balls
function update() {
    for (let i = 0; i < balls.length; i++) {
        let ballA = balls[i];
        let currentTopA = parseFloat(ballA.element.style.top);
        let currentLeftA = parseFloat(ballA.element.style.left);
        let sizeA = parseFloat(ballA.element.style.height);

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
            ballA.speedY *= -0.9;
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

// Toggle menu visibility
function toggleMenu() {
    let menuContainer = document.getElementById("menuContainer");
    let toggle = document.getElementById("menuToggle");

    if (menuContainer.classList.contains("collapsed")) {
        menuContainer.classList.remove("collapsed");
        menuContainer.classList.add("expanded");
        toggle.style.backgroundColor = 'black';
    } else {
        menuContainer.classList.remove("expanded");
        menuContainer.classList.add("collapsed");
        toggle.style.backgroundColor = 'transparent';
    }
}

// Toggle stats visibility
function toggleStats() {
    statsVisible = !statsVisible;
    let stats = document.getElementById("stats");
    stats.style.display = statsVisible ? "block" : "none";
}

// Update motion blur of balls
function updateBlur() {
    let blurValue = document.getElementById("blurAmount").value;
    document.querySelectorAll(".ball").forEach(ball => {
        ball.style.filter = `blur(${blurValue}px)`;
    });
}

// Clear all balls from the screen
function clearBalls() {
    balls.forEach(ball => {
        ball.element.remove();
    });
    balls = [];
    bounceCounter = 0;
    updateBallCount();
    document.getElementById("bounceCount").innerText = bounceCounter;
}

// Change background color of the body
function changeBackground() {
    document.body.style.backgroundColor = getRandomColor();
}

// Dragging functionality for the menu
const menuContainer = document.getElementById("menuContainer");
const menuToggle = document.getElementById("menuToggle");

menuToggle.addEventListener('mousedown', function (e) {
    isDragging = true;
    offset.x = e.clientX - menuContainer.offsetLeft;
    offset.y = e.clientY - menuContainer.offsetTop;
    menuContainer.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', function (e) {
    if (isDragging) {
        menuContainer.style.left = e.clientX - offset.x + 'px';
        menuContainer.style.top = e.clientY - offset.y + 'px';
    }
});

document.addEventListener('mouseup', function () {
    isDragging = false;
    menuContainer.style.cursor = 'grab';
});

update();
