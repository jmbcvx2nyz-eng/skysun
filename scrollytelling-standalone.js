// Scrollytelling Component - Vanilla JS Version
// Add this script to your HTML file

(function() {
  'use strict';

  const TOTAL_FRAMES = 240;
  let images = [];
  let currentFrame = 0;
  let imagesLoaded = false;
  let canvas, ctx, container;

  // Initialize
  function init() {
    container = document.getElementById('scrollytelling-container');
    if (!container) {
      console.error('Scrollytelling container not found');
      return;
    }

    canvas = document.getElementById('scrollytelling-canvas');
    if (!canvas) {
      console.error('Canvas not found');
      return;
    }

    ctx = canvas.getContext('2d');
    setupCanvas();
    loadImages();
    setupScroll();
    setupTextAnimations();
  }

  // Setup canvas
  function setupCanvas() {
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (imagesLoaded) drawFrame(currentFrame);
    }
    resize();
    window.addEventListener('resize', resize);
  }

  // Load all images
  function loadImages() {
    const loadingEl = document.getElementById('scrollytelling-loading');
    let loaded = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = i.toString().padStart(3, '0');
      
      img.onload = () => {
        loaded++;
        if (loadingEl) {
          loadingEl.textContent = `Loading... ${Math.round((loaded / TOTAL_FRAMES) * 100)}%`;
        }
        if (loaded === TOTAL_FRAMES) {
          imagesLoaded = true;
          if (loadingEl) loadingEl.parentElement.style.display = 'none';
          drawFrame(0);
        }
      };
      
      img.onerror = () => {
        loaded++;
        if (loaded === TOTAL_FRAMES) {
          imagesLoaded = true;
          if (loadingEl) loadingEl.parentElement.style.display = 'none';
          drawFrame(0);
        }
      };

      img.src = `/sequence/ezgif-frame-${frameNum}.png`;
      images.push(img);
    }
  }

  // Draw frame to canvas
  function drawFrame(index) {
    if (!ctx || images.length === 0) return;
    
    const clamped = Math.max(0, Math.min(Math.floor(index), images.length - 1));
    const img = images[clamped];
    if (!img || !img.complete) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const imgAspect = img.width / img.height;
    const canvasAspect = canvas.width / canvas.height;
    let w, h, x, y;

    if (imgAspect > canvasAspect) {
      h = canvas.height;
      w = h * imgAspect;
      x = (canvas.width - w) / 2;
      y = 0;
    } else {
      w = canvas.width;
      h = w / imgAspect;
      x = 0;
      y = (canvas.height - h) / 2;
    }

    ctx.drawImage(img, x, y, w, h);
  }

  // Setup scroll tracking
  function setupScroll() {
    const scrollContainer = document.getElementById('scrollytelling-scroll');
    if (!scrollContainer) return;

    function updateFrame() {
      const rect = scrollContainer.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const containerTop = scrollContainer.offsetTop;
      const containerHeight = scrollContainer.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      const scrollProgress = Math.max(0, Math.min(1, 
        (scrollTop - containerTop + viewportHeight) / containerHeight
      ));
      
      const frame = Math.floor(scrollProgress * (TOTAL_FRAMES - 1));
      if (frame !== currentFrame && imagesLoaded) {
        currentFrame = frame;
        drawFrame(frame);
      }
    }

    window.addEventListener('scroll', updateFrame);
    updateFrame();
  }

  // Setup text animations
  function setupTextAnimations() {
    const textElements = {
      title: document.getElementById('scrollytelling-title'),
      params: document.getElementById('scrollytelling-params'),
      speed: document.getElementById('scrollytelling-speed'),
      cta: document.getElementById('scrollytelling-cta')
    };

    function updateText() {
      const scrollContainer = document.getElementById('scrollytelling-scroll');
      if (!scrollContainer) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const containerTop = scrollContainer.offsetTop;
      const containerHeight = scrollContainer.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      const progress = Math.max(0, Math.min(1, 
        (scrollTop - containerTop + viewportHeight) / containerHeight
      ));

      // Title (0-0.2)
      if (textElements.title) {
        const titleOpacity = progress < 0.1 ? 1 : progress < 0.2 ? 1 - (progress - 0.1) * 10 : 0;
        const titleBlur = progress < 0.1 ? 0 : progress < 0.2 ? (progress - 0.1) * 100 : 10;
        textElements.title.style.opacity = titleOpacity;
        textElements.title.style.filter = `blur(${titleBlur}px)`;
      }

      // Params (0.2-0.5)
      if (textElements.params) {
        const paramsOpacity = progress < 0.2 ? 0 : progress < 0.3 ? (progress - 0.2) * 10 : progress < 0.4 ? 1 : progress < 0.5 ? 1 - (progress - 0.4) * 10 : 0;
        const paramsY = progress < 0.2 ? 30 : progress < 0.3 ? 30 - (progress - 0.2) * 300 : 0;
        const paramsBlur = progress < 0.2 ? 10 : progress < 0.3 ? 10 - (progress - 0.2) * 100 : progress < 0.4 ? 0 : progress < 0.5 ? (progress - 0.4) * 100 : 10;
        textElements.params.style.opacity = paramsOpacity;
        textElements.params.style.transform = `translateY(${paramsY}px)`;
        textElements.params.style.filter = `blur(${paramsBlur}px)`;
      }

      // Speed (0.5-0.8)
      if (textElements.speed) {
        const speedOpacity = progress < 0.5 ? 0 : progress < 0.6 ? (progress - 0.5) * 10 : progress < 0.7 ? 1 : progress < 0.8 ? 1 - (progress - 0.7) * 10 : 0;
        const speedY = progress < 0.5 ? 30 : progress < 0.6 ? 30 - (progress - 0.5) * 300 : 0;
        const speedBlur = progress < 0.5 ? 10 : progress < 0.6 ? 10 - (progress - 0.5) * 100 : progress < 0.7 ? 0 : progress < 0.8 ? (progress - 0.7) * 100 : 10;
        textElements.speed.style.opacity = speedOpacity;
        textElements.speed.style.transform = `translateY(${speedY}px)`;
        textElements.speed.style.filter = `blur(${speedBlur}px)`;
      }

      // CTA (0.8-1)
      if (textElements.cta) {
        const ctaOpacity = progress < 0.8 ? 0 : progress < 0.9 ? (progress - 0.8) * 10 : 1;
        const ctaY = progress < 0.8 ? 30 : progress < 0.9 ? 30 - (progress - 0.8) * 300 : 0;
        const ctaScale = progress < 0.8 ? 0.95 : progress < 0.9 ? 0.95 + (progress - 0.8) * 0.5 : 1;
        const ctaBlur = progress < 0.8 ? 10 : progress < 0.9 ? 10 - (progress - 0.8) * 100 : 0;
        textElements.cta.style.opacity = ctaOpacity;
        textElements.cta.style.transform = `translateY(${ctaY}px) scale(${ctaScale})`;
        textElements.cta.style.filter = `blur(${ctaBlur}px)`;
      }
    }

    window.addEventListener('scroll', updateText);
    updateText();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
