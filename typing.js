// Enhanced Typing Animation for TelsCup 6.0
document.addEventListener('DOMContentLoaded', () => {
  function initTypingAnimation() {
    const titleElement = document.querySelector('.main-title');
    if (!titleElement) return;

    const fullText = " TelsCup 6.0 ";
    let currentIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100; // milliseconds between characters
    let deleteSpeed = 50; // faster delete speed

    function typeWriter() {
      const currentText = fullText.substring(0, currentIndex);

      // Ensure the text is always visible
      titleElement.textContent = currentText;
      titleElement.style.visibility = 'visible';
      titleElement.style.opacity = '1';

      if (!isDeleting) {
        // Typing forward
        currentIndex++;

        // If we've finished typing the full text, start deleting after a short pause
        if (currentIndex === fullText.length) {
          isDeleting = true;
          setTimeout(typeWriter, 2000); // Pause before deleting
          return;
        }
      } else {
        // Deleting backward
        currentIndex--;

        // If we've deleted everything, start typing again
        if (currentIndex === 0) {
          isDeleting = false;
          setTimeout(typeWriter, 500); // Short pause before typing again
          return;
        }
      }

      // Continue the animation
      const speed = isDeleting ? deleteSpeed : typingSpeed;
      setTimeout(typeWriter, speed);
    }

    // Start the typing animation
    typeWriter();
  }

  // Initialize typing animation
  initTypingAnimation();
});
