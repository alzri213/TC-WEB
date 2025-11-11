document.addEventListener('DOMContentLoaded', () => {
  // Enhanced mobile detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Enhanced mouse/touch event handling
  let touchStartTime = 0;
  let lastTouchX = 0;
  let lastTouchY = 0;

  // Enhanced click interactions for link items
  document.querySelectorAll('.link-item').forEach((item, index) => {
    // Add staggered animation delay
    item.style.setProperty('--delay', index);

    item.addEventListener('click', function (e) {
      const title = this.querySelector('.link-title').textContent;
      const contact = this.querySelector('.link-contact').textContent;

      // Enhanced feedback with vibration on mobile
      if (isTouchDevice && 'vibrate' in navigator) {
        navigator.vibrate(50); // Short vibration feedback
      }

      // Show enhanced contact information
      showContactInfo(title, contact, e);
    });

    // Enhanced visual feedback
    item.addEventListener('touchstart', function () {
      this.style.transform = 'scale(0.96)';
    });

    item.addEventListener('touchend', function () {
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });

  // Enhanced contact info display
  function showContactInfo(title, contact, event) {
    // Remove any existing contact info
    const existingInfo = document.querySelector('.contact-info-popup');
    if (existingInfo) {
      existingInfo.remove();
    }

    const popup = document.createElement('div');
    popup.className = 'contact-info-popup';
    popup.innerHTML = `
      <div class="contact-content">
        <h3>${title}</h3>
        <p><strong>Contact:</strong> ${contact}</p>
        <button class="close-contact" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;

    // Position popup near click location
    if (event) {
      popup.style.position = 'fixed';
      popup.style.left = Math.min(event.clientX, window.innerWidth - 250) + 'px';
      popup.style.top = Math.min(event.clientY, window.innerHeight - 150) + 'px';
    }

    document.body.appendChild(popup);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (popup.parentElement) {
        popup.remove();
      }
    }, 5000);
  }

  // Enhanced button interactions
  const startButton = document.getElementById('startButton');
  if (startButton) {
    startButton.addEventListener('click', function (e) {
      // Enhanced feedback
      if (isTouchDevice && 'vibrate' in navigator) {
        navigator.vibrate([50, 30, 50]); // Pattern vibration
      }

      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });

    // Add touch feedback
    startButton.addEventListener('touchstart', function () {
      this.style.transform = 'scale(0.95)';
    });

    startButton.addEventListener('touchend', function () {
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  }

  // Enhanced join button interactions
  const joinButton = document.querySelector('.join-button');
  if (joinButton) {
    joinButton.addEventListener('click', function (e) {
      if (isTouchDevice && 'vibrate' in navigator) {
        navigator.vibrate(50);
      }

      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  }

  // Add keyboard navigation support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const focusedElement = document.activeElement;
      if (focusedElement.classList.contains('link-item') ||
          focusedElement.classList.contains('center-button') ||
          focusedElement.classList.contains('join-button')) {
        focusedElement.click();
      }
    }
  });

  // Enhanced pixel generation with better mobile performance
  function createPixel() {
    const pixel = document.createElement('div');
    pixel.className = 'pixel';
    pixel.style.left = Math.random() * 100 + '%';
    pixel.style.animationDuration = (Math.random() * 10 + 8) + 's';
    pixel.style.background = ['#ff006e', '#ffbe0b', '#fb5607', '#8338ec', '#3a86ff'][Math.floor(Math.random() * 5)];
    document.body.appendChild(pixel);

    setTimeout(() => {
      pixel.remove();
    }, 15000);
  }

  // Generate pixels less frequently on mobile
  const pixelInterval = isMobile ? 4000 : 2500;
  setInterval(createPixel, pixelInterval);

  // Add CSS for contact popup
  const contactPopupStyles = `
    .contact-info-popup {
      position: fixed;
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      padding: 20px;
      z-index: 1000;
      color: white;
      font-family: 'Press Start 2P', 'Courier New', monospace;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      animation: fadeInScale 0.3s ease;
    }

    .contact-content h3 {
      margin: 0 0 10px 0;
      font-size: 0.9rem;
      color: #ffbe0b;
    }

    .contact-content p {
      margin: 0 0 15px 0;
      font-size: 0.7rem;
      line-height: 1.4;
    }

    .close-contact {
      background: #ff006e;
      color: white;
      border: none;
      border-radius: 50%;
      width: 25px;
      height: 25px;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      float: right;
    }

    @keyframes fadeInScale {
      from {
        opacity: 0;
        transform: scale(0.8);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @media (max-width: 480px) {
      .contact-info-popup {
        max-width: 280px;
        font-size: 0.8rem;
      }

      .contact-content h3 {
        font-size: 0.8rem;
      }

      .contact-content p {
        font-size: 0.6rem;
      }
    }
  `;

  // Add the styles to the document
  const styleSheet = document.createElement('style');
  styleSheet.textContent = contactPopupStyles;
  document.head.appendChild(styleSheet);
});