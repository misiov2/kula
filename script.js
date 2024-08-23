<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Symulacja Kulek</title>
    <style>
        body {
            margin: 0;
            overflow: hidden;
            font-family: Arial, sans-serif;
        }
        #menuContainer {
            position: absolute;
            top: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.7);
            padding: 10px;
            border-radius: 5px;
            color: white;
        }
        .collapsed {
            display: none;
        }
        .button {
            display: block;
            margin: 5px 0;
            padding: 10px;
            background: #333;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .button:hover {
            background: #555;
        }
        #stats {
            margin-top: 10px;
        }
        #ballCount, #bounceCount {
            display: inline-block;
            margin: 0 5px;
        }
    </style>
</head>
<body>
    <div id="menuContainer">
        <button id="menuToggle" class="button">&#9654;</button>
        <button id="addBallButton" class="button">Dodaj Kulę</button>
        <input type="number" id="ballSize" placeholder="Rozmiar" value="30">
        <input type="number" id="ballSpeed" placeholder="Prędkość" value="2" step="0.1">
        <input type="color" id="ballColor" value="#ff0000">
        <button id="clearButton" class="button">Wyczyść</button>
        <button id="backgroundButton" class="button">Zmień Tło</button>
        <label>
            <input type="checkbox" id="statsToggle">
            Pokaż Statystyki
        </label>
        <div id="stats" class="collapsed">
            <span>Liczba kulek: <span id="ballCount">0</span></span><br>
            <span>Liczba odbić: <span id="bounceCount">0</span></span><br>
            <label>
                Rozmycie tła: <input type="range" id="blurAmount" min="0" max="10" step="0.1" value="0">
            </label>
        </div>
    </div>
    <script>
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
                const elasticity = 0.8; // Współczynnik sprężystości dla odbić

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
                            const angle = Math.atan2(dy, dx);
                            const overlap = minDistance - distance;

                            // Przesunięcie kulek
                            ballA.element.style.left = currentLeftA - Math.cos(angle) * (overlap / 2) + 'px';
                            ballA.element.style.top = currentTopA - Math.sin(angle) * (overlap / 2) + 'px';
                            ballB.element.style.left = currentLeftB + Math.cos(angle) * (overlap / 2) + 'px';
                            ballB.element.style.top = currentTopB + Math.sin(angle) * (overlap / 2) + 'px';

                            // Obliczanie nowych prędkości po kolizji
                            const normalX = dx / distance;
                            const normalY = dy / distance;

                            const relativeVelocityX = ballB.speedX - ballA.speedX;
                            const relativeVelocityY = ballB.speedY - ballA.speedY;
                            const dotProduct = (relativeVelocityX * normalX) + (relativeVelocityY * normalY);

                            const coefficient = (ballA.bounceCount % 5 === 0) ? -0.5 : -1;

                            if (dotProduct > 0) {
                                ballA.speedX += coefficient * dotProduct * normalX;
                                ballA.speedY += coefficient * dotProduct * normalY;
                                ballB.speedX -= coefficient * dotProduct * normalX;
                                ballB.speedY -= coefficient * dotProduct * normalY;

                                ballA.bounceCount++;
                                ballB.bounceCount++;

                                bounceCounter++;
                                document.getElementById('bounceCount').innerText = bounceCounter;
                            }
                        }
                    }

                    // Aktualizacja pozycji kulki
                    ballA.element.style.left = currentLeftA + ballA.speedX + 'px';
                    ballA.element.style.top = currentTopA + ballA.speedY + 'px';

                    // Odwrócenie kierunku ruchu po uderzeniu w krawędź ekranu
                    if (currentLeftA <= 0 || currentLeftA + sizeA >= window.innerWidth) {
                        ballA.speedX *= -elasticity;
                    }

                    if (currentTopA <= 0 || currentTopA + sizeA >= window.innerHeight) {
                        ballA.speedY *= -elasticity;
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
    </script>
</body>
</html>
