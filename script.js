document.addEventListener("DOMContentLoaded", function() {
    // Toggle menu visibility
    function toggleMenu() {
        let menuContainer = document.getElementById("menuContainer");
        menuContainer.classList.toggle("collapsed");

        let toggle = document.getElementById("menuToggle");
        if (menuContainer.classList.contains("collapsed")) {
            toggle.innerHTML = "&#9654;"; // Strzałka w prawo
        } else {
            toggle.innerHTML = "&#9664;"; // Strzałka w lewo
        }
    }

    // Make menu draggable
    dragElement(document.getElementById("menuContainer"));

    function dragElement(elmnt) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById("menuToggle")) {
            // if present, the header is where you move the DIV from:
            document.getElementById("menuToggle").onmousedown = dragMouseDown;
        } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Set up menu toggle
    document.getElementById("menuToggle").addEventListener("click", toggleMenu);
});
