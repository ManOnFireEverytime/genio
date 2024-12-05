document.addEventListener("DOMContentLoaded", () => {
  const leftTopButton = document.querySelector(".left-top");
  const leftMidButton = document.querySelector(".left-mid");
  const leftBottomButton = document.querySelector(".left-bottom");
  const rightTopButton = document.querySelector(".right-top");
  const rightMidButton = document.querySelector(".right-mid");
  const rightBottomButton = document.querySelector(".right-bottom");
  const cubeContainer = document.getElementById("cube-container");
  const cubesContainer = document.querySelector(".cubes-container");

  function createConnectionLines() {
    if (window.innerWidth >= 1025) {
      function createStraightLine(button, isLeft) {
        const line = document.createElement("div");
        line.classList.add("connection-line");

        const buttonRect = button.getBoundingClientRect();
        const containerRect = cubesContainer.getBoundingClientRect();
        const cubeRect = cubeContainer.getBoundingClientRect();

        // Calculate the center of the cube container
        const cubeCenterY =
          cubeRect.top - containerRect.top + cubeRect.height / 2;

        const startX = isLeft
          ? buttonRect.right - containerRect.left
          : buttonRect.left - containerRect.left;
        const startY = cubeCenterY; // Base startY for calculations

        const endX = cubeRect.left - containerRect.left + cubeRect.width / 2;
        const endY = cubeCenterY; // Ensure the line ends at the center of the cube container

        const distance = Math.sqrt(
          Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
        );

        const angle =
          (Math.atan2(endY - startY, endX - startX) * 180) / Math.PI;

        line.style.width = `${distance}px`;
        line.style.height = "32px";
        line.style.transformOrigin = "0 0";
        line.style.transform = `rotate(${angle}deg)`;
        line.style.position = "absolute";
        line.style.left = `${startX}px`;
        line.style.opacity = "0.2";

        // Adjust only the `top` style for the left line
        line.style.top = isLeft ? `${startY - 32}px` : `${startY}px`;

        cubesContainer.appendChild(line);
      }

      function createCurvedLine(button, isTop, isLeft) {
        const line = document.createElement("div");
        line.classList.add("connection-line-curved");

        const buttonRect = button.getBoundingClientRect();
        const containerRect = cubesContainer.getBoundingClientRect();
        const cubeRect = cubeContainer.getBoundingClientRect();

        const startX = isLeft
          ? buttonRect.right - containerRect.left
          : buttonRect.left - containerRect.left;
        const startY =
          buttonRect.top - containerRect.top + buttonRect.height / 2;
        const endX = cubeRect.left - containerRect.left + cubeRect.width / 2;
        const endY = cubeRect.top - containerRect.top + cubeRect.height / 2;

        const svg = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.style.position = "absolute";
        svg.style.left = "0";
        svg.style.top = "0";
        svg.style.pointerEvents = "none";

        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );

        const multiplier = isTop ? -1 : 1;
        const controlPointY = startY + ((endY - startY) / 2) * multiplier;

        const pathData = `
                M ${startX} ${startY}
                Q ${(startX + endX) / 2} ${controlPointY} ${endX} ${endY}
              `;

        path.setAttribute("d", pathData);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "white");
        path.setAttribute("stroke-opacity", "0.2");
        path.setAttribute("stroke-width", "32");

        svg.appendChild(path);
        cubesContainer.appendChild(svg);
      }

      // Straight lines for middle buttons
      createStraightLine(leftMidButton, true);
      createStraightLine(rightMidButton, false);

      // Curved lines for top and bottom buttons
      createCurvedLine(leftTopButton, true, true);
      createCurvedLine(leftBottomButton, true, true);
      createCurvedLine(rightTopButton, true, false);
      createCurvedLine(rightBottomButton, true, false);
    }
  }

  // Initial connection lines
  createConnectionLines();

  // Recreate lines on window resize
  window.addEventListener("resize", () => {
    // Remove existing lines
    cubesContainer
      .querySelectorAll(".connection-line, .connection-line-curved, svg")
      .forEach((line) => line.remove());
    createConnectionLines();
  });
});
