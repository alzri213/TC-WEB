document.addEventListener('DOMContentLoaded', () => {
  // Enhanced Particle animation system with better mobile optimization
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particlesArray = [];
  let width, height;
  let hue = 0;
  let mouse = {
    x: undefined,
    y: undefined,
    radius: 150
  };

  // Enhanced mobile detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Enhanced mouse/touch event handling
  let touchStartTime = 0;
  let lastTouchX = 0;
  let lastTouchY = 0;

  // Handle mouse movement (desktop)
  window.addEventListener('mousemove', (event) => {
    if (!isMobile) {
      mouse.x = event.x;
      mouse.y = event.y;
    }
  });

  // Enhanced touch handling for mobile
  window.addEventListener('touchstart', (event) => {
    if (isTouchDevice) {
      touchStartTime = Date.now();
      if (event.touches.length > 0) {
        lastTouchX = event.touches[0].clientX;
        lastTouchY = event.touches[0].clientY;
        mouse.x = lastTouchX;
        mouse.y = lastTouchY;
      }
    }
  });

  window.addEventListener('touchmove', (event) => {
    if (isTouchDevice && event.touches.length > 0) {
      const touch = event.touches[0];
      const deltaX = Math.abs(touch.clientX - lastTouchX);
      const deltaY = Math.abs(touch.clientY - lastTouchY);

      // Only update if movement is significant (reduces jitter)
      if (deltaX > 2 || deltaY > 2) {
        mouse.x = touch.clientX;
        mouse.y = touch.clientY;
        lastTouchX = touch.clientX;
        lastTouchY = touch.clientY;
      }
    }
  });

  window.addEventListener('touchend', () => {
    if (isTouchDevice) {
      // Add a small delay before clearing mouse position for better UX
      setTimeout(() => {
        mouse.x = undefined;
        mouse.y = undefined;
      }, 100);
    }
  });

  // Handle mouse/touch leaving the window
  window.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;
  });

  function initCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Enhanced particle count calculation based on device capabilities
    let baseCount;
    if (isMobile) {
      // Fewer particles on mobile for better performance
      baseCount = Math.min(30, Math.floor((width * height) / 20000));
    } else {
      // More particles on desktop
      baseCount = Math.min(80, Math.floor((width * height) / 12000));
    }

    createParticles(baseCount);
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = isMobile ? Math.random() * 2 + 0.5 : Math.random() * 3 + 1; // Smaller particles on mobile
      this.speedX = (Math.random() - 0.5) * (isMobile ? 0.5 : 1); // Slower movement on mobile
      this.speedY = (Math.random() - 0.5) * (isMobile ? 0.5 : 1);
      this.color = `hsl(${hue}, 100%, 70%)`;
      this.brightness = 70;
      this.life = 0;
      this.maxLife = 1000 + Math.random() * 2000; // Particle lifetime
    }

    update() {
      // Bounce off walls
      if (this.x < 0 || this.x > width) this.speedX = -this.speedX;
      if (this.y < 0 || this.y > height) this.speedY = -this.speedY;

      // Mouse/touch interaction with enhanced responsiveness
      if (mouse.x && mouse.y) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Adjust interaction radius based on device
        const interactionRadius = isMobile ? 80 : 120;

        if (distance < interactionRadius) {
          const force = (interactionRadius - distance) / interactionRadius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * (isMobile ? 2 : 4);
          this.y -= Math.sin(angle) * force * (isMobile ? 2 : 4);
        }
      }

      // Move particle
      this.x += this.speedX;
      this.y += this.speedY;

      // Color animation with reduced computation on mobile
      if (!isMobile || Math.random() > 0.7) { // Less frequent updates on mobile
        this.brightness = 50 + Math.sin(Date.now() * 0.001 + this.x * 0.01) * 20;
        this.color = `hsl(${hue}, 100%, ${this.brightness}%)`;
      }

      // Update particle life
      this.life++;
      if (this.life > this.maxLife) {
        // Reset particle
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.life = 0;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = isMobile ? 5 : 10; // Less shadow blur on mobile for performance
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function createParticles(num) {
    particlesArray = [];
    for (let i = 0; i < num; i++) {
      particlesArray.push(new Particle());
    }
  }

  function connectParticles() {
    // Adjust connection distance based on device
    const maxDistance = isMobile ? 80 : 120;

    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        const dx = particlesArray[a].x - particlesArray[b].x;
        const dy = particlesArray[a].y - particlesArray[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = 1 - distance / maxDistance;
          ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${opacity * 0.2})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Slowly change hue for color animation
    hue += 0.3;
    if (hue > 360) hue = 0;

    particlesArray.forEach(p => {
      p.update();
      p.draw();
    });

    connectParticles();
    requestAnimationFrame(animate);
  }

  // Handle window resize with debouncing
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      initCanvas();
    }, 250); // Debounce resize events
  });

  // Initialize
  initCanvas();
  animate();

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

  // Performance monitoring for mobile devices
  if (isMobile) {
    // Reduce animation complexity if performance is poor
    let frameCount = 0;
    let lastTime = performance.now();

    function monitorPerformance() {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) { // Check every second
        const fps = frameCount;

        // If FPS is too low, reduce particle count
        if (fps < 30 && particlesArray.length > 20) {
          particlesArray = particlesArray.slice(0, 20);
        }

        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(monitorPerformance);
    }

    monitorPerformance();
  }

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
