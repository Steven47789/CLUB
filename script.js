document.addEventListener('DOMContentLoaded', () => {
    // ========== HERO ROTATOR OPTIMIZADO ==========
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.hero-prev');
    const nextBtn = document.querySelector('.hero-next');
    const dotsContainer = document.querySelector('.hero-dots');
    const heroSection = document.querySelector('.hero');
    
    let currentIndex = 0;
    let autoPlayInterval = null;
    let isTransitioning = false;
    let animationFrameId = null;
    let isHeroVisible = true;
    let zoomAnimationInterval = null;
    const AUTO_DELAY = 5000;
    
    function startZoomAnimation() {
        if (zoomAnimationInterval) clearInterval(zoomAnimationInterval);
        const slidesContainer = document.querySelector('.hero-slides');
        if (!slidesContainer) return;
        
        let scale = 1;
        let direction = 1;
        
        zoomAnimationInterval = setInterval(() => {
            if (!isHeroVisible || isTransitioning) return;
            
            scale += direction * 0.0004;
            if (scale >= 1.05) direction = -1;
            if (scale <= 1) direction = 1;
            
            if (slidesContainer) {
                slidesContainer.style.transform = `scale(${scale})`;
            }
        }, 50);
    }
    
    function stopZoomAnimation() {
        if (zoomAnimationInterval) {
            clearInterval(zoomAnimationInterval);
            zoomAnimationInterval = null;
        }
        const slidesContainer = document.querySelector('.hero-slides');
        if (slidesContainer) {
            slidesContainer.style.transform = 'scale(1)';
        }
    }
    
    function updateSlider(index) {
        if (isTransitioning) return;
        
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        if (currentIndex === index) return;
        
        isTransitioning = true;
        
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        
        animationFrameId = requestAnimationFrame(() => {
            slides[currentIndex].classList.remove('active');
            slides[index].classList.add('active');
            currentIndex = index;
            
            const dots = document.querySelectorAll('.hero-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
            
            setTimeout(() => {
                isTransitioning = false;
                animationFrameId = null;
            }, 100);
        });
    }
    
    function nextSlide() {
        if (isTransitioning) return;
        updateSlider(currentIndex + 1);
        resetAutoPlay();
    }
    
    function prevSlide() {
        if (isTransitioning) return;
        updateSlider(currentIndex - 1);
        resetAutoPlay();
    }
    
    function resetAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
            if (!isTransitioning && isHeroVisible) nextSlide();
        }, AUTO_DELAY);
    }
    
    function createDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < slides.length; i++) {
            const dot = document.createElement('button');
            dot.classList.add('hero-dot');
            if (i === currentIndex) dot.classList.add('active');
            dot.setAttribute('data-index', i);
            dot.addEventListener('click', () => {
                if (isTransitioning) return;
                updateSlider(parseInt(dot.getAttribute('data-index')));
                resetAutoPlay();
            });
            dotsContainer.appendChild(dot);
        }
    }
    
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isHeroVisible = entry.isIntersecting;
            if (!isHeroVisible) {
                stopZoomAnimation();
                if (autoPlayInterval) clearInterval(autoPlayInterval);
            } else {
                startZoomAnimation();
                resetAutoPlay();
            }
        });
    }, { threshold: 0.1 });
    
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    createDots();
    slides[0].classList.add('active');
    resetAutoPlay();
    startZoomAnimation();
    
    if (heroSection) {
        heroObserver.observe(heroSection);
        
        heroSection.addEventListener('mouseenter', () => {
            if (autoPlayInterval) clearInterval(autoPlayInterval);
            stopZoomAnimation();
        });
        
        heroSection.addEventListener('mouseleave', () => {
            if (isHeroVisible) {
                resetAutoPlay();
                startZoomAnimation();
            }
        });
    }
    
    // ========== ANIMACIÓN DE NÚMEROS ==========
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;
    
    function animateStats() {
        if (statsAnimated) return;
        
        const statsSection = document.querySelector('.stats-grid');
        if (!statsSection) return;
        
        const rect = statsSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100 && rect.bottom > 0;
        
        if (isVisible && !statsAnimated) {
            statsAnimated = true;
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                if (isNaN(target)) return;
                
                let current = 0;
                const duration = 1500;
                const stepTime = 20;
                const steps = duration / stepTime;
                const increment = target / steps;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        stat.innerText = target;
                        clearInterval(timer);
                    } else {
                        stat.innerText = Math.floor(current);
                    }
                }, stepTime);
            });
        }
    }
    
    window.addEventListener('scroll', animateStats);
    animateStats();
    
    // ========== PARALLAX EFFECT ==========
    const parallaxSection = document.querySelector('.cancha-bg-section');
    
    if (parallaxSection) {
        function updateParallax() {
            if (window.innerWidth > 768) {
                const scrolled = window.pageYOffset;
                const sectionTop = parallaxSection.offsetTop;
                const sectionHeight = parallaxSection.offsetHeight;
                const viewportHeight = window.innerHeight;
                
                const sectionCenter = sectionTop + sectionHeight / 2;
                const viewportCenter = scrolled + viewportHeight / 2;
                
                const distanceFromCenter = (viewportCenter - sectionCenter) / (sectionHeight);
                
                let translateY = distanceFromCenter * 40;
                translateY = Math.min(Math.max(translateY, -30), 30);
                
                parallaxSection.style.backgroundPositionY = `calc(50% + ${translateY}px)`;
            }
        }
        
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        updateParallax();
    }
    
    // ========== PARTIDO EN VIVO ==========
    function updateLiveMatch() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentDay = now.getDay();
        const currentTime = currentHour + currentMinute / 60;
        
        const PRIMER_TURNO_INICIO = 19 + 20/60;
        const PRIMER_TURNO_FIN = 21;
        const SEGUNDO_TURNO_INICIO = 21 + 50/60;
        const SEGUNDO_TURNO_FIN = 23 + 30/60;
        
        const DIAS_PARTIDO = [1, 2, 3, 4, 5, 6];
        
        const statusElement = document.getElementById('matchStatus');
        const statusTextSpan = document.getElementById('statusText');
        const turnoInfoSpan = document.getElementById('turnoInfo');
        const dayTextSpan = document.getElementById('dayText');
        const liveBtn = document.getElementById('liveBtn');
        
        const hayPartidoHoy = DIAS_PARTIDO.includes(currentDay);
        const diasNombres = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const diaActualNombre = diasNombres[currentDay];
        
        if (!hayPartidoHoy) {
            statusElement.className = 'match-status offline';
            statusTextSpan.innerHTML = 'SIN ACTIVIDAD';
            turnoInfoSpan.innerHTML = `Hoy ${diaActualNombre} no hay partidos`;
            if (dayTextSpan) dayTextSpan.innerHTML = `${diaActualNombre}`;
            if (liveBtn) liveBtn.style.display = 'none';
            return;
        }
        
        if (dayTextSpan) dayTextSpan.innerHTML = diaActualNombre;
        
        if (liveBtn) liveBtn.style.display = 'inline-flex';
        
        const enPrimerTurno = currentTime >= PRIMER_TURNO_INICIO && currentTime <= PRIMER_TURNO_FIN;
        const enSegundoTurno = currentTime >= SEGUNDO_TURNO_INICIO && currentTime <= SEGUNDO_TURNO_FIN;
        const primerTurnoPasado = currentTime > PRIMER_TURNO_FIN;
        const segundoTurnoPasado = currentTime > SEGUNDO_TURNO_FIN;
        
        if (enPrimerTurno) {
            statusElement.className = 'match-status live';
            statusTextSpan.innerHTML = 'EN VIVO';
            turnoInfoSpan.innerHTML = `PRIMER TURNO · 19:20 — 21:00`;
        } 
        else if (enSegundoTurno) {
            statusElement.className = 'match-status live';
            statusTextSpan.innerHTML = 'EN VIVO';
            turnoInfoSpan.innerHTML = `SEGUNDO TURNO · 21:50 — 23:30`;
        }
        else if (!primerTurnoPasado && currentTime < PRIMER_TURNO_INICIO) {
            const minutosFaltantes = Math.round((PRIMER_TURNO_INICIO - currentTime) * 60);
            const horasFaltantes = Math.floor(minutosFaltantes / 60);
            const minsFaltantes = minutosFaltantes % 60;
            
            statusElement.className = 'match-status upcoming';
            statusTextSpan.innerHTML = 'PRÓXIMO';
            
            let tiempoTexto = horasFaltantes > 0 ? `${horasFaltantes}h ${minsFaltantes}min` : `${minsFaltantes}min`;
            turnoInfoSpan.innerHTML = `PRIMER TURNO · ${tiempoTexto} (19:20)`;
        }
        else if (primerTurnoPasado && !segundoTurnoPasado && currentTime < SEGUNDO_TURNO_INICIO) {
            const minutosFaltantes = Math.round((SEGUNDO_TURNO_INICIO - currentTime) * 60);
            const horasFaltantes = Math.floor(minutosFaltantes / 60);
            const minsFaltantes = minutosFaltantes % 60;
            
            statusElement.className = 'match-status upcoming';
            statusTextSpan.innerHTML = 'PRÓXIMO';
            
            let tiempoTexto = horasFaltantes > 0 ? `${horasFaltantes}h ${minsFaltantes}min` : `${minsFaltantes}min`;
            turnoInfoSpan.innerHTML = `SEGUNDO TURNO · ${tiempoTexto} (21:50)`;
        }
        else {
            statusElement.className = 'match-status ended';
            statusTextSpan.innerHTML = 'FIN';
            turnoInfoSpan.innerHTML = `Hoy terminaron los partidos`;
            if (liveBtn) liveBtn.style.display = 'none';
        }
    }
    
    updateLiveMatch();
    setInterval(updateLiveMatch, 60000);
    
    // ========== PILARES ANIMATION ==========
    const pillars = document.querySelectorAll('.pillar');
    const pillarObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                pillarObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    pillars.forEach(pillar => {
        pillar.style.opacity = '0';
        pillar.style.transform = 'translateY(20px)';
        pillar.style.transition = 'all 0.5s ease';
        pillarObserver.observe(pillar);
    });
    
    // ========== CARRUSEL ==========
    const track = document.getElementById('carouselTrack');
    const prevBtnCarousel = document.getElementById('carouselPrev');
    const nextBtnCarousel = document.getElementById('carouselNext');
    const prevSmallBtn = document.getElementById('carouselPrevBtn');
    const nextSmallBtn = document.getElementById('carouselNextBtn');
    const dotsCarousel = document.querySelectorAll('.carousel-dots .dot');
    const slidesCount = document.querySelectorAll('.carousel-slide').length;
    const currentSlideSpan = document.getElementById('currentSlide');
    const totalSlidesSpan = document.getElementById('totalSlides');
    
    let currentSlideIndex = 0;
    let autoScrollInterval = null;
    const AUTO_DELAY_CAROUSEL = 5000;
    
    if (totalSlidesSpan) totalSlidesSpan.textContent = slidesCount;
    
    function updateCarousel() {
        if (!track) return;
        track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
        
        dotsCarousel.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentSlideIndex);
        });
        
        if (currentSlideSpan) currentSlideSpan.textContent = currentSlideIndex + 1;
    }
    
    function nextSlideCarousel() {
        currentSlideIndex = (currentSlideIndex + 1) % slidesCount;
        updateCarousel();
        resetAutoScroll();
    }
    
    function prevSlideCarousel() {
        currentSlideIndex = (currentSlideIndex - 1 + slidesCount) % slidesCount;
        updateCarousel();
        resetAutoScroll();
    }
    
    function goToSlide(index) {
        currentSlideIndex = index;
        updateCarousel();
        resetAutoScroll();
    }
    
    function startAutoScroll() {
        if (autoScrollInterval) clearInterval(autoScrollInterval);
        autoScrollInterval = setInterval(nextSlideCarousel, AUTO_DELAY_CAROUSEL);
    }
    
    function resetAutoScroll() {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            startAutoScroll();
        }
    }
    
    function stopAutoScroll() {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
    }
    
    if (prevBtnCarousel) prevBtnCarousel.addEventListener('click', prevSlideCarousel);
    if (nextBtnCarousel) nextBtnCarousel.addEventListener('click', nextSlideCarousel);
    if (prevSmallBtn) prevSmallBtn.addEventListener('click', prevSlideCarousel);
    if (nextSmallBtn) nextSmallBtn.addEventListener('click', nextSlideCarousel);
    
    dotsCarousel.forEach((dot, idx) => {
        dot.addEventListener('click', () => goToSlide(idx));
    });
    
    const carouselMain = document.querySelector('.carousel-main');
    if (carouselMain) {
        carouselMain.addEventListener('mouseenter', stopAutoScroll);
        carouselMain.addEventListener('mouseleave', startAutoScroll);
    }
    
    updateCarousel();
    startAutoScroll();
    
    // ========== BOTÓN WHATSAPP ==========
    const contactarBtn = document.querySelector('.support-btn-secondary');
    if (contactarBtn) {
        contactarBtn.addEventListener('click', () => {
            window.location.href = 'https://wa.me/51987654321?text=Hola%2C%20quiero%20contactar%20con%20la%20comisi%C3%B3n%20del%20club%20Amigos%20Peloteros';
        });
    }

    // ========== SOCIAL ICONS INTERACTION ==========
    const socialIcons = document.querySelectorAll('.social-icon');
    
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    console.log('✅ Club Deportivo Amigos Peloteros - Web cargada correctamente');
});