document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const menuContainer = document.getElementById('menuContainer');
    const addBallButton = document.getElementById('addBallButton');
    const statsToggle = document.getElementById('statsToggle');
    const statsDiv = document.getElementById('stats');
    const blurAmount = document.getElementById('blurAmount');
    const clearButton = document.getElementById('clearButton');
    const backgroundButton = document.getElementById('backgroundButton');

    let balls = [];
    let bounceCounter = 0;

    // Funkcja tworząca nową kulkę
    function createBall(size, speed, color) {
        const ball = {
            element: document.createElement('div'),
            size: size,
            speedX: speed * (Math.random() * 2 - 1),
            speedY: speed * (Math.random() * 2 - 1),
            bounceCount: 0
        };

        ball.element.style.width = size + 'px';
        ball.element.style.height = size + 'px';
        ball.element.style.borderRadius = '50%';
        ball.element.style.backgroundColor = color;
        ball.element.style.position = 'absolute';
        ball.element.style.left = Math.random() * (window.innerWidth - size) + 'px';
        ball.element.style.top = Math.random() * (window.innerHeight - size) + 'px';

        document.body.appendChild(ball.element);
        balls.push(ball);
        updateBallCount();
    }

    // Funkcja aktualizująca liczbę kulek
    function updateBallCount() {
        document.getElementById('ballCount').innerText = balls.length;
    }

    // Funkcja aktualizująca pozycję kulek
    function update() {
        const gravity = 0.1;

        for (let i = 0; i < balls.length; i++) {
            const ballA = balls[i];
            const currentLeftA = parseInt(ballA.element.style.left);
            const currentTopA = parseInt(ballA.element.style.top);
            const sizeA = ballA.size;

            // Sprawdzenie kolizji z innymi kulkami
            for (let j = i + 1; j < balls.length; j++) {
                const ballB = balls[j];
                const currentLeftB = parseInt(ballB.element.style.left);
                const currentTopB = parseInt(ballB.element.style.top);
                const sizeB = ballB.size;

                const dx = currentLeftB - currentLeftA;
                const dy = currentTopB - currentTopA;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = sizeA / 2 + sizeB / 2;

                if (distance < minDistance) {
                    // Obliczanie kąta zderzenia
                    let angle = Math.atan2(dy, dx);
                    // Obliczanie punktu kolizji
                    let targetX = currentLeftA + Math.cos(angle) * minDistance;
                    let targetY = currentTopA + Math.sin(angle) * minDistance;
                    // Obliczanie przyspieszenia
                    let ax = (targetX - currentLeftB) * 0.05;
                    let ay = (targetY - currentTopB) * 0.05;

                    // Zastosowanie przyspieszenia do prędkości kulek
                    ballA.speedX += ax;
                    ballA.speedY += ay;
                    ballB.speedX -= ax;
                    ballB.speedY -= ay;

                    // Zwiększenie licznika odbicia
                    ballA.bounceCount++;
                    ballB.bounceCount++;

                    bounceCounter++;
                    document.getElementById('bounceCount').innerText = bounceCounter;

                    // Usuwanie kulki po 5 odbiciach
                    if (ballA.bounceCount % 5 === 0) {
                        ballA.speedY = -Math.abs(ballA.speedY); // Skierowanie kulki w górę
                    }

                    if (ballB.bounceCount % 5 === 0) {
                        ballB.speedY = -Math.abs(ballB.speedY); // Skierowanie kulki w górę
                    }
                }
            }

            // Aktualizacja pozycji kulki
            ballA.element.style.left = currentLeftA + ballA.speedX + 'px';
            ballA.element.style.top = currentTopA + ballA.speedY + 'px';

            // Odwrócenie kierunku ruchu po uderzeniu w krawędź ekranu
            if (currentLeftA <= 0 || currentLeftA + sizeA >= window.innerWidth) {
                ballA.speedX *= -1;
            }

            if (currentTopA <= 0 || currentTopA + sizeA >= window.innerHeight) {
                ballA.speedY *= -1;
            }

            // Dodanie grawitacji
            ballA.speedY += gravity;
        }

        requestAnimationFrame(update);
    }

    // Funkcje do obsługi zdarzeń
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

    update();
});
