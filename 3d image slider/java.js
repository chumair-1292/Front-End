document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  const scene = document.getElementById('scene');
  const dotsContainer = document.getElementById('dotsContainer');
  
  let currentIndex = 0;
  const totalCards = cards.length;

  // Render Dots dynamically based on card count
  cards.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetAutoPlay(); // Reset timer on click
    });
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.dot');

  // Update Carousel Position with Inverted Curve towards screen
  function updateCarousel() {
    const radius = window.innerWidth < 600 ? 300 : 420;

    cards.forEach((card, index) => {
      let offset = index - currentIndex;

      // Infinite loop mapping logic
      if (offset > totalCards / 2) offset -= totalCards;
      if (offset < -totalCards / 2) offset += totalCards;

      const angle = offset * 32; // Degree spread between cards

      // Inverted Curve: Cards curve towards user screen (Positive Z depth for sides)
      const xPos = Math.sin((angle * Math.PI) / 180) * radius;
      const zPos = (1 - Math.cos((angle * Math.PI) / 180)) * radius; 

      const opacity = Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.2;

      // Animation via GSAP
      gsap.to(card, {
        x: xPos,
        z: zPos,
        rotationY: -angle, // Negative angle rotates side cards towards center
        scale: offset === 0 ? 1 : 0.85,
        opacity: opacity,
        duration: 0.7,
        ease: 'power2.out',
        zIndex: totalCards - Math.abs(offset)
      });
    });

    // Update Dots UI
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalCards;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalCards) % totalCards;
    updateCarousel();
  }

  /* ---------------- 5 SECOND AUTO SLIDE CODE ---------------- */
  let autoPlayTimer;

  function startAutoPlay() {
    autoPlayTimer = setInterval(() => {
      nextSlide();
    }, 5000); // 5000ms = 5 Seconds
  }

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }

  // Mouse over par pause aur mouse hatane par auto-slide dubara shuru
  scene.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
  scene.addEventListener('mouseleave', () => startAutoPlay());
  /* ----------------------------------------------------------- */

  /* ---------------- MOUSE / DRAG CONTROL LOGIC ---------------- */
  let startX = 0;
  let isDragging = false;

  // Mouse Drag Support
  scene.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const diffX = e.clientX - startX;
    if (diffX > 50) {
      prevSlide();
      resetAutoPlay();
      isDragging = false;
    } else if (diffX < -50) {
      nextSlide();
      resetAutoPlay();
      isDragging = false;
    }
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch Swipe Support for Mobile
  scene.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });

  scene.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const diffX = endX - startX;
    if (diffX > 40) {
      prevSlide();
      resetAutoPlay();
    }
    if (diffX < -40) {
      nextSlide();
      resetAutoPlay();
    }
  });

  // Mouse Scroll Wheel Control
  let scrollTimeout;
  scene.addEventListener('wheel', (e) => {
    e.preventDefault();
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      if (e.deltaY > 0 || e.deltaX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      resetAutoPlay();
    }, 40);
  }, { passive: false });

  // Initial Load & Start Auto Play
  updateCarousel();
  startAutoPlay();
  window.addEventListener('resize', updateCarousel);
});