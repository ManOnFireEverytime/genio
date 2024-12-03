const track = document.querySelector(".carousel-track");
const prevButton = document.querySelector(".arrow.prev");
const nextButton = document.querySelector(".arrow.next");
const cards = Array.from(track.children);

let currentIndex = 0;

function updateActiveClass() {
  // Remove 'active' class and contact buttons from all cards
  cards.forEach((card) => {
    card.classList.remove("active");
    card.querySelector(".contact-btn")?.remove();
    card.querySelector(".testimonial-date").style.display = "block";
  });

  // Calculate the index of the middle card (active card)
  const activeIndex = (currentIndex + 1) % cards.length;

  // Add 'active' class to the middle card
  const activeCard = cards[activeIndex];
  activeCard.classList.add("active");

  // Hide the date for the active card
  activeCard.querySelector(".testimonial-date").style.display = "none";

  // Add Contact Button
  const contactBtn = document.createElement("button");
  contactBtn.className = "contact-btn";
  contactBtn.textContent = "Contact Us";
  activeCard.appendChild(contactBtn);

  // Handle visibility of cards based on screen size
  if (window.innerWidth >= 1201) {
    // Large screens: show 3 cards
    cards.forEach((card, index) => {
      card.style.display = "none";
    });

    const visibleCards = [
      cards[(activeIndex - 1 + cards.length) % cards.length],
      activeCard,
      cards[(activeIndex + 1) % cards.length],
    ];

    visibleCards.forEach((card) => {
      card.style.display = "flex";
    });
  } else if (window.innerWidth <= 768) {
    // Small screens: show only active card
    cards.forEach((card, index) => {
      card.style.display = "none";
    });
    activeCard.style.display = "flex";
  }
}

function rotateCarousel(direction) {
  if (direction === "next") {
    // Move the first card to the end
    track.appendChild(track.firstElementChild);
    currentIndex = (currentIndex + 1) % cards.length;
  } else {
    // Move the last card to the start
    track.insertBefore(track.lastElementChild, track.firstElementChild);
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
  }

  // Update the active class
  updateActiveClass();
}

// Event Listeners
nextButton.addEventListener("click", () => rotateCarousel("next"));
prevButton.addEventListener("click", () => rotateCarousel("prev"));

// Add resize event listener to update card visibility
window.addEventListener("resize", updateActiveClass);

// Initialize
updateActiveClass();

// Auto-scroll (optional)
setInterval(() => rotateCarousel("next"), 6000);
