let shakeEnabled = false;
let shakeThreshold = 15; // Próg w celu wykrywania potrząsania

function toggleShake() {
    shakeEnabled = !shakeEnabled;
    if (shakeEnabled) {
        window.addEventListener('devicemotion', handleShake);
    } else {
        window.removeEventListener('devicemotion', handleShake);
    }
}

function handleShake(event) {
    let acceleration = event.accelerationIncludingGravity;
    let ax = acceleration.x;
    let ay = acceleration.y;
    let az = acceleration.z;
    
    let totalAcceleration = Math.sqrt(ax * ax + ay * ay + az * az);
    
    if (totalAcceleration > shakeThreshold) {
        balls.forEach(ball => {
            // Apply a random force to the ball
            ball.speedX += (Math.random() - 0.5) * 10;
            ball.speedY += (Math.random() - 0.5) * 10;
        });
    }
}

// Update the function to include shaking
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
    }

    requestAnimationFrame(update);
}
