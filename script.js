let balls = [];
let gravity = 0.2;
let bounceCounter = 0;
let statsVisible = false;

function addBall() {
    let size = document.getElementById("ballSize").value;
    let speed = document.getElementById("ballSpeed").value;
    let color = document.getElementById("ballColor").value;
    createBall(size, speed, color);
}

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

function updateBallCount() {
    document.getElementById("ballCount").innerText = balls.length;
}

function update() {
    for (let i = 0; i < balls.length; i++) {
        let ballA = balls[i];
        let currentTopA = parseFloat(ballA.element.style.top);
        let currentLeftA = parseFloat(ballA.element.style.left);
        let sizeA = parseFloat(ballA.element.style.height);

        if (currentTopA >= window.innerHeight - sizeA) {
            ballA.speedY *= -0.9;
            ballA.bounceCount++;
            bounceCounter++;
            if (ballA.bounceCount % 5 === 0) {
                ballA.speedY -= 10;
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

function toggleMenu() {
    let menuContainer = document.getElementById("menuContainer");
    menuContainer.classList.toggle("collapsed");

    let toggle = document.getElementById("menuToggle");
    if (menuContainer.classList.contains("collapsed")) {
        toggle.innerHTML = "&#9654;";
    } else {
        toggle.innerHTML = "&#9664;";
    }
}

function toggleStats() {
    statsVisible = !statsVisible;
    let stats = document.getElementById("stats");
    stats.style.display = statsVisible ? "block" : "none";
}

function updateBlur() {
    let blurValue = document.getElementById("blurAmount").value;
    document.querySelectorAll(".ball").forEach(ball => {
        ball.style.filter = `blur(${blurValue}px)`;
    });
}

function clearBalls() {
    balls.forEach(ball => {
        ball.element.remove();
    });
    balls = [];
    bounceCounter = 0;
    updateBallCount();
    document.getElementById("bounceCount").innerText = bounceCounter;
}

function changeBackground() {
    document.body.style.backgroundColor = getRandomColor();
}

function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

// Dodaj obsługę przeciągania
let isDragging = false;
let startX, startY, initialLeft, initialTop;

const menuContainer = document.getElementById("menuContainer");

menuContainer.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialLeft = menuContainer.offsetLeft;
    initialTop = menuContainer.offsetTop;
    menuContainer.classList.add("dragging");
});

document.addEventListener("mousemove", (e) => {
    if (isDragging) {
        let deltaX = e.clientX - startX;
        let deltaY = e.clientY - startY;
        menuContainer.style.left = `${initialLeft + deltaX}px`;
        menuContainer.style.top = `${initialTop + deltaY}px`;
    }
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    menuContainer.classList.remove("dragging");
});

update();
