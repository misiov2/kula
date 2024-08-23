document.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.getElementById('menuContainer');
    const menuToggle = document.getElementById('menuToggle');

    let isMenuOpen = false;

    menuToggle.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        menuContainer.classList.toggle('expanded', isMenuOpen);
        menuToggle.innerHTML = isMenuOpen ? '&#9664;' : '&#9654;'; // Przycisk zmienia kształt
    });

    // Dodanie funkcji przesuwania menu
    let startX, startY, initialLeft, initialTop;
    menuContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        initialLeft = parseFloat(window.getComputedStyle(menuContainer).left);
        initialTop = parseFloat(window.getComputedStyle(menuContainer).top);
        menuContainer.style.transition = 'none'; // Wyłączenie animacji podczas przesuwania
    });

    menuContainer.addEventListener('touchmove', (e) => {
        const deltaX = e.touches[0].clientX - startX;
        const deltaY = e.touches[0].clientY - startY;
        menuContainer.style.left = `${Math.max(0, Math.min(initialLeft + deltaX, window.innerWidth - menuContainer.offsetWidth))}px`;
        menuContainer.style.top = `${Math.max(0, Math.min(initialTop + deltaY, window.innerHeight - menuContainer.offsetHeight))}px`;
    });

    menuContainer.addEventListener('touchend', () => {
        menuContainer.style.transition = 'transform 0.3s ease'; // Przywrócenie animacji
    });
});
