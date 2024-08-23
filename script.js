document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const addBallButton = document.getElementById('addBallButton');
    const clearButton = document.getElementById('clearButton');
    const backgroundButton = document.getElementById('backgroundButton');
    const statsToggle = document.getElementById('statsToggle');
    const statsDiv = document.getElementById('stats');
    const blurAmount = document.getElementById('blurAmount');

    let balls = [];
    let bounceCounter = 0;

    function createBall(size, speed, color) {
        const ball = {
            element: document.createElement('div'),
            size: size,
            speedX: speed * (Math.random() * 2 - 1),
            speedY: speed * (Math.random() * 2 - 1),
            bounceCount: 0
        };

        ball.element.className = 'ball';
        ball.element.style.width = size + 'px';
        ball.element.style.height = size + 'px';
        ball.element.style.backgroundColor = color;
        ball.element.style.left = Math.random() * (window.innerWidth - size) + 'px';
        ball.element.style.top = Math.random() * (window.innerHeight - size) + 'px';

        document.body.appendChild(ball.element);
        balls.push(ball);
        updateBallCount();
    }

    function updateBallCount() {
        document.getElementById('ballCount').innerText = balls.length;
    }

    function update() {
        const gravity = 0.1;
        const elasticity = 0.8;

        for (let i = 0; i < balls.length; i++) {
            const ballA = balls[i];
            const currentLeftA = parseFloat(ballA.element.style.left);
            const currentTopA = parseFloat(ballA.element.style.top);
            const sizeA = ballA.size;

            for (let j = i + 1; j < balls.length; j++) {
                const ballB = balls[j];
                const currentLeftB = parseFloat(ballB.element.style.left);
                const currentTopB = parseFloat(ballB.element.style.top);
                const sizeB = ballB.size;

                const dx = currentLeftB - currentLeftA;
                const dy = currentTopB - currentTopA;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = sizeA / 2 + sizeB / 2;

                if (distance < minDistance) {
                    const angle = Math.atan2(dy, dx);
                    const overlap = minDistance - distance;

                    ballA.element.style.left = (currentLeftA - Math.cos(angle) * (overlap / 2)) + 'px';
                    ballA.element.style.top = (currentTopA - Math.sin(angle) * (overlap / 2)) + 'px';
                    ballB.element.style.left = (currentLeftB + Math.cos(angle) * (overlap / 2)) + 'px';
                    ballB.element.style.top = (currentTopB + Math.sin(angle) * (overlap / 2)) + 'px';

                    const normalX = dx / distance;
                    const normalY = dy / distance;

                    const relativeVelocityX = ballB.speedX - ballA.speedX;
                    const relativeVelocityY = ballB.speedY - ballA.speedY;
                    const dotProduct = (relativeVelocityX * normalX) + (relativeVelocityY * normalY);

                    if (dotProduct > 0) {
                        const coefficient = (ballA.bounceCount % 5 === 0) ? -0.5 : -1;
                        ballA.speedX += coefficient * dotProduct * normalX;
                        ballA.speedY += coefficient * dotProduct * normalY;
                        ballB.speedX -= coefficient * dotProduct * normalX;
                        ballB.speedY -= coefficient * dotProduct * normalY;

                        ballA.bounceCount++;
                        ballB.bounceCount++;

                        bounceCounter++;
                        document.getElementById('bounceCount').innerText = bounceCounter;

                        if (ballA.bounceCount % 5 === 0) {
                            ballA.speedY = -Math.abs(ballA.speedY);
                        }

                        if (ballB.bounceCount % 5 === 0) {
                            ballB.speedY = -Math.abs(ballB.speedY);
                        }
                    }
                }
            }

            ballA.element.style.left = (currentLeftA + ballA.speedX) + 'px';
            ballA.element.style.top = (currentTopA + ballA.speedY) + 'px';

            if (currentLeftA <= 0 || currentLeftA + sizeA >= window.innerWidth) {
                ballA.speedX *= -elasticity;
            }

            if (currentTopA <= 0 || currentTopA + sizeA >= window.innerHeight) {
                ballA.speedY *= -elasticity;
            }

            ballA.speedY += gravity;
        }

        requestAnimationFrame(update);
    }

    menuToggle.addEventListener('click', () => {
        menuContainer.classList.toggle('collapsed');
        menuToggle.innerHTML = menuContainer.classList.contains('collapsed') ? '&#9654;' : '&#9664;';
    });

    addBallButton.addEventListener('click', () => {
        const size = parseInt(document.getElementById('ballSize').value);
        const speed = parseFloat(document.getElementById('ballSpeed').value);
        const color = document.getElementById('ballColor').value;
        createBall(size, speed, color);
    });

    clearButton.addEventListener('click', () => {
        balls.forEach(ball => document.body.removeChild(ball.element));
        balls = [];
        updateBallCount();
    });

    backgroundButton.addEventListener('click', () => {
        document.body.style.backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    });

    update();
});
