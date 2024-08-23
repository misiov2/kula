document.addEventListener("DOMContentLoaded", function() {
    function toggleMenu() {
        let menuContainer = document.getElementById("menuContainer");
        menuContainer.classList.toggle("expanded");

        let toggle = document.getElementById("menuToggle");
        if (menuContainer.classList.contains("expanded")) {
            toggle.innerHTML = "&#9664;"; // Strzałka w lewo
        } else {
            toggle.innerHTML = "&#9654;"; // Strzałka w prawo
        }
    }

    function makeMenuDraggable(elmnt) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        document.getElementById("menuToggle").onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    makeMenuDraggable(document.getElementById("menuContainer"));

    document.getElementById("menuToggle").addEventListener("click", toggleMenu);
});
