document.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.getElementById('menuContainer');
    const menuToggle = document.getElementById('menuToggle');
    const addBallButton = document.getElementById('addBallButton');
    const statsToggle = document.getElementById('statsToggle');
    const blurAmount = document.getElementById('blurAmount');
    const clearButton = document.getElementById('clearButton');
    const backgroundButton = document.getElementById('backgroundButton');
    const statsDiv = document.getElementById('stats');

    let balls = [];
    let gravity = 0.2;
    let bounceCounter = 0;

    let isMenuOpen = false;

    menuToggle.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        menuContainer.classList.toggle('expanded', isMenuOpen);
        menuToggle.innerHTML = isMenuOpen ? '&#9664;' : '&#9776;';
    });

    // Przesuwanie menu
    let startX, startY, initialLeft, initialTop;
    menuContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        initialLeft = parseFloat(window.getComputedStyle(menuContainer).left);
        initialTop = parseFloat(window.getComputedStyle(menuContainer).top);
        menuContainer.style.transition = 'none';
    });

    menuContainer.addEventListener('touchmove', (e) => {
        const deltaX = e.touches[0].clientX - startX;
        const deltaY = e.touches[0].clientY - startY;
        menuContainer.style.left = `${Math.max(0, Math.min(initialLeft + deltaX, window.innerWidth - menuContainer.offsetWidth))}px`;
        menuContainer.style.top = `${Math.max(0, Math.min(initialTop + deltaY, window.innerHeight - menuContainer.offsetHeight))}px`;
    });

    menuContainer.addEventListener('touchend', () => {
        menuContainer.style.transition = 'transform 0.3s ease';
    });

    // Funkcje
    function createBall(size, speed, color) {
        let ball = document.createElement('div');
        ball.className = 'ball';
        ball.style.width = size + 'px';
        ball.style.height = size + 'px';
        ball.style.backgroundColor = color;
        ball.style.left = Math.random() * (window.innerWidth - size) + 'px';
        ball.style.top = Math.random() * (window.innerHeight - size) + 'px';
        document.body.appendChild(ball);
        balls.push({ element: ball, speedX: Math.random() * 10 - 5, speedY: parseFloat(speed), bounceCount: 0 });
        updateBallCount();
    }

    function updateBallCount() {
        document.getElementById('ballCount').innerText = balls.length;
    }

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
                    let ax = (targetX - currentLeftB) * 0.05;
                    let ay = (targetY - currentTopB) * 0.05;

                    ballA.speedX += ax;
                    ballA.speedY += ay;
                    ballB.speedX -= ax;
                    ballB.speedY -= ay;

                    ballA.bounceCount++;
                    ballB.bounceCount++;

                    bounceCounter++;
                    document.getElementById('bounceCount').innerText = bounceCounter;

                    if (bounceCounter % 5 === 0) {
                        ballA.element.style.display = 'none';
                        setTimeout(() => {
                            document.body.removeChild(ballA.element);
                            balls = balls.filter(b => b !== ballA);
                            updateBallCount();
                        }, 1000);
                    }
                }
            }

            ballA.element.style.left = currentLeftA + ballA.speedX + 'px';
            ballA.element.style.top = currentTopA + ballA.speedY + 'px';

            if (currentLeftA <= 0 || currentLeftA + sizeA >= window.innerWidth) {
                ballA.speedX *= -1;
            }

            if (currentTopA <= 0 || currentTopA + sizeA >= window.innerHeight) {
                ballA.speedY *= -1;
            }

            ballA.speedY += gravity;
        }

        requestAnimationFrame(update);
    }

    update();

    addBallButton.addEventListener('click', () => {
        const size = parseInt(document.getElementById('ballSize').value);
        const speed = parseFloat(document.getElementById('ballSpeed').value);
        const color = document.getElementById('ballColor').value;
        createBall(size, speed, color);
    });

    statsToggle.addEventListener('change', () => {
        statsDiv.style.display = statsToggle.checked ? 'block' : 'none';
    });

    blurAmount.addEventListener('input', () => {
        document.body.style.filter = `blur(${blurAmount.value}px)`;
    });

    clearButton.addEventListener('click', () => {
        balls.forEach(ball => document.body.removeChild(ball.element));
        balls = [];
        updateBallCount();
    });

    backgroundButton.addEventListener('click', () => {
        document.body.style.backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    });
});
