// Create the scene
const scene = new THREE.Scene();

// Create the camera
// const camera = new THREE.PerspectiveCamera(
//   55,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   1000
// );

let fov = window.innerWidth > 1000 ? 65 : 75;

const camera = new THREE.PerspectiveCamera(
  fov,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// Create the renderer with a transparent background
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.setClearColor(0x000000, 0); // Transparent background
const container = document.getElementById("cube-container");
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Add light to the scene
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
scene.add(ambientLight);

// Create canvas for text texture
function createTextTexture(text) {
  const canvas = document.createElement("canvas");
  canvas.width = 512; // Large canvas
  canvas.height = 512;
  const context = canvas.getContext("2d");

  // Clear canvas with purple background
  context.fillStyle = "rgb(128, 0, 128)"; // Vibrant purple
  context.fillRect(0, 0, canvas.width, canvas.height);
  // Create black edges (thin black cubes) between the main cubes

  // Set font and styling
  context.font = "Bold 120px Arial";
  context.fillStyle = "white"; // White text
  context.textAlign = "center";
  context.textBaseline = "middle";

  // Draw text
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  // Create texture from canvas
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Load the 3D model
const loader = new THREE.GLTFLoader();
let model;
let isRotating = true; // Track if the model is rotating

loader.load(
  "assets/rubik3.glb", // Path to your 3D model
  (gltf) => {
    model = gltf.scene;
    model.scale.set(1.5, 1.5, 1.5); // Adjust the scale
    scene.add(model);

    // Create VAT texture
    const vatTexture = createTextTexture("VAT");
    const taxTexture = createTextTexture("TAX");
    const accsTexture = createTextTexture("ACCS");
    const accssTexture = createTextTexture("IPSUM");
    const pnhTexture = createTextTexture("PNH");

    // Capture the original material of a non-textured cube face
    let originalMaterial;

    // Apply materials to all meshes
    model.traverse((child) => {
      if (child.isMesh) {
        // If this is a typical GLTF export, the first mesh might be the base material
        if (!originalMaterial && child.material) {
          originalMaterial = child.material.clone();
        }

        // Create a material that matches the original cube face
        const frontFaceMaterial = originalMaterial
          ? originalMaterial.clone()
          : new THREE.MeshStandardMaterial({
              color: 0x800080, // Fallback purple
            });

        // Apply the VAT texture to the front face material
        frontFaceMaterial.map = vatTexture;
        frontFaceMaterial.color.setHex(0xffffff); // Ensure purple color
        frontFaceMaterial.needsUpdate = true;

        // Check if this is likely the front face
        if (child.name === "Object_12") {
          child.material = frontFaceMaterial;
          console.log("Applied VAT texture to:", child.name);
        } else if (child.name === "Object_8") {
          // TAX texture for Object_8 with flipping
          const taxFaceMaterial = originalMaterial
            ? originalMaterial.clone()
            : new THREE.MeshStandardMaterial({
                color: 0x800080, // Fallback purple
              });

          const flippedTaxTexture = taxTexture.clone(); // Clone the texture to avoid global flipping
          flippedTaxTexture.center.set(0.5, 0.5); // Set the center for proper flipping
          flippedTaxTexture.rotation = Math.PI; // Rotate the texture 180° to flip
          flippedTaxTexture.needsUpdate = true;

          taxFaceMaterial.map = flippedTaxTexture;
          taxFaceMaterial.color.setHex(0xffffff);
          taxFaceMaterial.needsUpdate = true;

          child.material = taxFaceMaterial;
          console.log("Applied flipped TAX texture to:", child.name);
        } else if (child.name === "Object_10") {
          // TAX texture for Object_8 with flipping
          const accsFaceMaterial = originalMaterial
            ? originalMaterial.clone()
            : new THREE.MeshStandardMaterial({
                color: 0x800080, // Fallback purple
              });

          const flippedTaxTexture = accsTexture.clone(); // Clone the texture to avoid global flipping
          flippedTaxTexture.center.set(0.5, 0.5); // Set the center for proper flipping
          flippedTaxTexture.rotation = Math.PI / 2; // Rotate the texture 180° to flip
          flippedTaxTexture.needsUpdate = true;

          accsFaceMaterial.map = flippedTaxTexture;
          accsFaceMaterial.color.setHex(0xffffff);
          accsFaceMaterial.needsUpdate = true;

          child.material = accsFaceMaterial;
          console.log("Applied flipped ACCS texture to:", child.name);
        } else if (child.name === "Object_14") {
          // TAX texture for Object_8 with flipping
          const accsFaceMaterial = originalMaterial
            ? originalMaterial.clone()
            : new THREE.MeshStandardMaterial({
                color: 0x800080, // Fallback purple
              });

          const flippedTaxTexture = accssTexture.clone(); // Clone the texture to avoid global flipping
          flippedTaxTexture.center.set(0.5, 0.5); // Set the center for proper flipping
          // flippedTaxTexture.rotation = -Math.PI / 2; // Rotate the texture 180° to flip
          flippedTaxTexture.needsUpdate = true;

          accsFaceMaterial.map = flippedTaxTexture;
          accsFaceMaterial.color.setHex(0xffffff);
          accsFaceMaterial.needsUpdate = true;

          child.material = accsFaceMaterial;
          console.log("Applied flipped ACCS texture to:", child.name);
        } else if (child.name === "Object_4") {
          // Create a new canvas specifically for the logo
          const logoCanvas = document.createElement("canvas");
          logoCanvas.width = 512; // Size of the logo canvas
          logoCanvas.height = 512; // Size of the logo canvas
          const logoContext = logoCanvas.getContext("2d");

          // Fill the canvas with vibrant purple color (for the background)
          logoContext.fillStyle = "rgb(132, 2, 132)"; // Vibrant purple color (brighter)
          logoContext.fillRect(0, 0, logoCanvas.width, logoCanvas.height); // Apply the purple color

          // Load and draw the logo image
          const logoImage = new Image();
          logoImage.onload = () => {
            // Draw the logo on the canvas, scaling it down to fit
            logoContext.drawImage(
              logoImage,
              logoCanvas.width / 4,
              logoCanvas.height / 4,
              logoCanvas.width / 2,
              logoCanvas.height / 2
            );

            // Create texture from the canvas
            const logoTexture = new THREE.CanvasTexture(logoCanvas);
            logoTexture.needsUpdate = true;

            // Apply the logo texture to the material
            const logoMaterial = new THREE.MeshStandardMaterial({
              color: 0xffffff, // Set the material color to white
              map: logoTexture, // Apply the logo texture
              side: THREE.DoubleSide, // Make sure the texture appears on both sides
            });

            // Apply the logo material to all sub-faces of Object_6
            child.material = logoMaterial;
            console.log("Applied logo texture to all faces of:", child.name);
          };

          // Set the logo image source (adjust the path as needed)
          logoImage.src = "logo.png";
        } else if (child.name === "Object_6") {
          const accsFaceMaterial = originalMaterial
            ? originalMaterial.clone()
            : new THREE.MeshStandardMaterial({
                color: 0x800080, // Fallback purple
              });

          const flippedTaxTexture = pnhTexture.clone(); // Clone the texture to avoid global flipping
          flippedTaxTexture.center.set(0.5, 0.5); // Set the center for proper flipping
          flippedTaxTexture.rotation = Math.PI; // Rotate the texture 180° to flip
          flippedTaxTexture.needsUpdate = true;

          accsFaceMaterial.map = flippedTaxTexture;
          accsFaceMaterial.color.setHex(0xffffff);
          accsFaceMaterial.needsUpdate = true;

          child.material = accsFaceMaterial;
          // // Create a new canvas specifically for the logo
          // const logoCanvas = document.createElement("canvas");
          // logoCanvas.width = 512; // Size of the logo canvas
          // logoCanvas.height = 512; // Size of the logo canvas
          // const logoContext = logoCanvas.getContext("2d");

          // // Fill the canvas with vibrant purple color (for the background)
          // logoContext.fillStyle = "rgb(132, 2, 132)"; // Vibrant purple color (brighter)
          // logoContext.fillRect(0, 0, logoCanvas.width, logoCanvas.height); // Apply the purple color

          // // Load and draw the logo image
          // const logoImage = new Image();
          // logoImage.onload = () => {
          //   // Draw the logo on the canvas, scaling it down to fit
          //   logoContext.drawImage(
          //     logoImage,
          //     logoCanvas.width / 4,
          //     logoCanvas.height / 4,
          //     logoCanvas.width / 2,
          //     logoCanvas.height / 2
          //   );

          //   // Create texture from the canvas
          //   const logoTexture = new THREE.CanvasTexture(logoCanvas);
          //   logoTexture.needsUpdate = true;

          //   // Apply the logo texture to the material
          //   const logoMaterial = new THREE.MeshStandardMaterial({
          //     color: 0xffffff, // Set the material color to white
          //     map: logoTexture, // Apply the logo texture
          //     side: THREE.DoubleSide, // Make sure the texture appears on both sides
          //   });

          //   // Apply the logo material to all sub-faces of Object_6
          //   child.material = logoMaterial;
          //   console.log("Applied logo texture to all faces of:", child.name);
          // };

          // // Set the logo image source (adjust the path as needed)
          // logoImage.src = "logo2.png";
        } else if (child.material) {
          // Ensure other faces remain purple
          child.material.color.setHex(0x800080);
        }
      }
    });
  },
  (xhr) => console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}% completed`),
  (error) => console.error("An error occurred:", error)
);

// Rotate the model and render the scene
function animate() {
  requestAnimationFrame(animate);

  if (model && isRotating) {
    model.rotation.y += 0.01; // Default constant rotation
  }

  renderer.render(scene, camera);
}

animate();

// Handle mouse movement to interact with the model
container.addEventListener("mousemove", (event) => {
  if (model && isRotating) {
    const { clientX, clientY } = event;
    const x = (clientX / container.clientWidth) * 2 - 1;
    const y = -(clientY / container.clientHeight) * 2 + 1;

    model.rotation.x = y * Math.PI * 0.1;
    model.rotation.y = x * Math.PI * 0.1;
  }
});

// Make the canvas responsive
window.addEventListener("resize", () => {
  const width = container.clientWidth;
  const height = container.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});

// Button click event to rotate the cube to a specific face
document.getElementById("rotateButton").addEventListener("click", () => {
  if (model) {
    // Stop continuous rotation
    isRotating = false;

    // Create a smooth rotation to the front face
    const startRotation = model.rotation.clone();
    const targetRotation = new THREE.Euler(0, -Math.PI / 2, 0);

    function smoothRotate(progress) {
      model.rotation.x = THREE.MathUtils.lerp(
        startRotation.x,
        targetRotation.x,
        progress
      );
      model.rotation.y = THREE.MathUtils.lerp(
        startRotation.y,
        targetRotation.y,
        progress
      );
      model.rotation.z = THREE.MathUtils.lerp(
        startRotation.z,
        targetRotation.z,
        progress
      );

      renderer.render(scene, camera);

      if (progress < 1) {
        requestAnimationFrame(() => smoothRotate(progress + 0.05));
      }
    }

    smoothRotate(0);

    // Show the desired grid
    const allGrids = document.querySelectorAll(".service-grid");
    const targetGrid = document.querySelector("#accounts .service-grid");

    // Remove active class from all grids
    allGrids.forEach((grid) => {
      grid.classList.remove("active");
    });

    // Add active class to the target grid
    targetGrid.classList.add("active");
  }
});
document.getElementById("rotateButtons").addEventListener("click", () => {
  if (model) {
    // Stop continuous rotation
    isRotating = false;

    // Create a smooth rotation to the front face
    const startRotation = model.rotation.clone();
    const targetRotation = new THREE.Euler(0, -Math.PI / 2, 0);

    function smoothRotate(progress) {
      model.rotation.x = THREE.MathUtils.lerp(
        startRotation.x,
        targetRotation.x,
        progress
      );
      model.rotation.y = THREE.MathUtils.lerp(
        startRotation.y,
        targetRotation.y,
        progress
      );
      model.rotation.z = THREE.MathUtils.lerp(
        startRotation.z,
        targetRotation.z,
        progress
      );

      renderer.render(scene, camera);

      if (progress < 1) {
        requestAnimationFrame(() => smoothRotate(progress + 0.05));
      }
    }

    smoothRotate(0);

    // Show the desired grid
    const allGrids = document.querySelectorAll(".service-grid");
    const targetGrid = document.querySelector("#accounts .service-grid");

    // Remove active class from all grids
    allGrids.forEach((grid) => {
      grid.classList.remove("active");
    });

    // Add active class to the target grid
    targetGrid.classList.add("active");
  }
});
document.getElementById("rotateButton2").addEventListener("click", () => {
  if (model) {
    // Stop continuous rotation
    isRotating = false;

    // Create a smooth rotation to the front face
    const startRotation = model.rotation.clone();
    const targetRotation = new THREE.Euler(0, Math.PI / 2, 0);

    function smoothRotate(progress) {
      model.rotation.x = THREE.MathUtils.lerp(
        startRotation.x,
        targetRotation.x,
        progress
      );
      model.rotation.y = THREE.MathUtils.lerp(
        startRotation.y,
        targetRotation.y,
        progress
      );
      model.rotation.z = THREE.MathUtils.lerp(
        startRotation.z,
        targetRotation.z,
        progress
      );

      renderer.render(scene, camera);

      if (progress < 1) {
        requestAnimationFrame(() => smoothRotate(progress + 0.05));
      }
    }

    smoothRotate(0);

    // Show the desired grid
    const allGrids = document.querySelectorAll(".service-grid");
    const targetGrid = document.querySelector("#tax .service-grid");

    // Remove active class from all grids
    allGrids.forEach((grid) => {
      grid.classList.remove("active");
    });

    // Add active class to the target grid
    targetGrid.classList.add("active");
  }
});
document.getElementById("rotateButton2s").addEventListener("click", () => {
  if (model) {
    // Stop continuous rotation
    isRotating = false;

    // Create a smooth rotation to the front face
    const startRotation = model.rotation.clone();
    const targetRotation = new THREE.Euler(0, Math.PI / 2, 0);

    function smoothRotate(progress) {
      model.rotation.x = THREE.MathUtils.lerp(
        startRotation.x,
        targetRotation.x,
        progress
      );
      model.rotation.y = THREE.MathUtils.lerp(
        startRotation.y,
        targetRotation.y,
        progress
      );
      model.rotation.z = THREE.MathUtils.lerp(
        startRotation.z,
        targetRotation.z,
        progress
      );

      renderer.render(scene, camera);

      if (progress < 1) {
        requestAnimationFrame(() => smoothRotate(progress + 0.05));
      }
    }

    smoothRotate(0);

    // Show the desired grid
    const allGrids = document.querySelectorAll(".service-grid");
    const targetGrid = document.querySelector("#tax .service-grid");

    // Remove active class from all grids
    allGrids.forEach((grid) => {
      grid.classList.remove("active");
    });

    // Add active class to the target grid
    targetGrid.classList.add("active");
  }
});
document.getElementById("rotateButton3").addEventListener("click", () => {
  if (model) {
    // Stop continuous rotation
    isRotating = false;

    // Create a smooth rotation to the front face
    const startRotation = model.rotation.clone();
    const targetRotation = new THREE.Euler(0, 0, 0);

    function smoothRotate(progress) {
      model.rotation.x = THREE.MathUtils.lerp(
        startRotation.x,
        targetRotation.x,
        progress
      );
      model.rotation.y = THREE.MathUtils.lerp(
        startRotation.y,
        targetRotation.y,
        progress
      );
      model.rotation.z = THREE.MathUtils.lerp(
        startRotation.z,
        targetRotation.z,
        progress
      );

      renderer.render(scene, camera);

      if (progress < 1) {
        requestAnimationFrame(() => smoothRotate(progress + 0.05));
      }
    }

    smoothRotate(0);

    // Show the desired grid
    const allGrids = document.querySelectorAll(".service-grid");
    const targetGrid = document.querySelector("#vat .service-grid");

    // Remove active class from all grids
    allGrids.forEach((grid) => {
      grid.classList.remove("active");
    });

    // Add active class to the target grid
    targetGrid.classList.add("active");
  }
});
document.getElementById("rotateButton3s").addEventListener("click", () => {
  if (model) {
    // Stop continuous rotation
    isRotating = false;

    // Create a smooth rotation to the front face
    const startRotation = model.rotation.clone();
    const targetRotation = new THREE.Euler(0, 0, 0);

    function smoothRotate(progress) {
      model.rotation.x = THREE.MathUtils.lerp(
        startRotation.x,
        targetRotation.x,
        progress
      );
      model.rotation.y = THREE.MathUtils.lerp(
        startRotation.y,
        targetRotation.y,
        progress
      );
      model.rotation.z = THREE.MathUtils.lerp(
        startRotation.z,
        targetRotation.z,
        progress
      );

      renderer.render(scene, camera);

      if (progress < 1) {
        requestAnimationFrame(() => smoothRotate(progress + 0.05));
      }
    }

    smoothRotate(0);

    // Show the desired grid
    const allGrids = document.querySelectorAll(".service-grid");
    const targetGrid = document.querySelector("#vat .service-grid");

    // Remove active class from all grids
    allGrids.forEach((grid) => {
      grid.classList.remove("active");
    });

    // Add active class to the target grid
    targetGrid.classList.add("active");
  }
});
document.getElementById("rotateButton4").addEventListener("click", () => {
  if (model) {
    // Stop continuous rotation
    isRotating = false;

    // Create a smooth rotation to the front face
    const startRotation = model.rotation.clone();
    const targetRotation = new THREE.Euler(-Math.PI / 2, 0, 0);

    function smoothRotate(progress) {
      model.rotation.x = THREE.MathUtils.lerp(
        startRotation.x,
        targetRotation.x,
        progress
      );
      model.rotation.y = THREE.MathUtils.lerp(
        startRotation.y,
        targetRotation.y,
        progress
      );
      model.rotation.z = THREE.MathUtils.lerp(
        startRotation.z,
        targetRotation.z,
        progress
      );

      renderer.render(scene, camera);

      if (progress < 1) {
        requestAnimationFrame(() => smoothRotate(progress + 0.05));
      }
    }

    smoothRotate(0);
  }
});
document.getElementById("rotateButton4s").addEventListener("click", () => {
  if (model) {
    // Stop continuous rotation
    isRotating = false;

    // Create a smooth rotation to the front face
    const startRotation = model.rotation.clone();
    const targetRotation = new THREE.Euler(-Math.PI / 2, 0, 0);

    function smoothRotate(progress) {
      model.rotation.x = THREE.MathUtils.lerp(
        startRotation.x,
        targetRotation.x,
        progress
      );
      model.rotation.y = THREE.MathUtils.lerp(
        startRotation.y,
        targetRotation.y,
        progress
      );
      model.rotation.z = THREE.MathUtils.lerp(
        startRotation.z,
        targetRotation.z,
        progress
      );

      renderer.render(scene, camera);

      if (progress < 1) {
        requestAnimationFrame(() => smoothRotate(progress + 0.05));
      }
    }

    smoothRotate(0);
  }
});
document.getElementById("rotateButton5").addEventListener("click", () => {
  if (model) {
    // Stop continuous rotation
    isRotating = false;

    // Create a smooth rotation to the front face
    const startRotation = model.rotation.clone();
    const targetRotation = new THREE.Euler(Math.PI / 2, 0, 0);

    function smoothRotate(progress) {
      model.rotation.x = THREE.MathUtils.lerp(
        startRotation.x,
        targetRotation.x,
        progress
      );
      model.rotation.y = THREE.MathUtils.lerp(
        startRotation.y,
        targetRotation.y,
        progress
      );
      model.rotation.z = THREE.MathUtils.lerp(
        startRotation.z,
        targetRotation.z,
        progress
      );

      renderer.render(scene, camera);

      if (progress < 1) {
        requestAnimationFrame(() => smoothRotate(progress + 0.05));
      }
    }

    smoothRotate(0);
  }
});
document.getElementById("rotateButton5s").addEventListener("click", () => {
  if (model) {
    // Stop continuous rotation
    isRotating = false;

    // Create a smooth rotation to the front face
    const startRotation = model.rotation.clone();
    const targetRotation = new THREE.Euler(Math.PI / 2, 0, 0);

    function smoothRotate(progress) {
      model.rotation.x = THREE.MathUtils.lerp(
        startRotation.x,
        targetRotation.x,
        progress
      );
      model.rotation.y = THREE.MathUtils.lerp(
        startRotation.y,
        targetRotation.y,
        progress
      );
      model.rotation.z = THREE.MathUtils.lerp(
        startRotation.z,
        targetRotation.z,
        progress
      );

      renderer.render(scene, camera);

      if (progress < 1) {
        requestAnimationFrame(() => smoothRotate(progress + 0.05));
      }
    }

    smoothRotate(0);
  }
});

document.getElementById("rotateButton6").addEventListener("click", () => {
  if (model) {
    // Stop continuous rotation
    isRotating = false;

    // Create a smooth rotation to the front face
    const startRotation = model.rotation.clone();
    const targetRotation = new THREE.Euler(0, Math.PI / 1, 0);

    function smoothRotate(progress) {
      model.rotation.x = THREE.MathUtils.lerp(
        startRotation.x,
        targetRotation.x,
        progress
      );
      model.rotation.y = THREE.MathUtils.lerp(
        startRotation.y,
        targetRotation.y,
        progress
      );
      model.rotation.z = THREE.MathUtils.lerp(
        startRotation.z,
        targetRotation.z,
        progress
      );

      renderer.render(scene, camera);

      if (progress < 1) {
        requestAnimationFrame(() => smoothRotate(progress + 0.05));
      }
    }

    smoothRotate(0);
  }
});
document.getElementById("rotateButton6s").addEventListener("click", () => {
  if (model) {
    // Stop continuous rotation
    isRotating = false;

    // Create a smooth rotation to the front face
    const startRotation = model.rotation.clone();
    const targetRotation = new THREE.Euler(0, Math.PI / 1, 0);

    function smoothRotate(progress) {
      model.rotation.x = THREE.MathUtils.lerp(
        startRotation.x,
        targetRotation.x,
        progress
      );
      model.rotation.y = THREE.MathUtils.lerp(
        startRotation.y,
        targetRotation.y,
        progress
      );
      model.rotation.z = THREE.MathUtils.lerp(
        startRotation.z,
        targetRotation.z,
        progress
      );

      renderer.render(scene, camera);

      if (progress < 1) {
        requestAnimationFrame(() => smoothRotate(progress + 0.05));
      }
    }

    smoothRotate(0);
  }
});
