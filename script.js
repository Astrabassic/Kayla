class ImageSlider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.querySelector('.prev');
        this.nextBtn = document.querySelector('.next');
        this.dotsContainer = document.querySelector('.dots-container');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.playPauseText = document.getElementById('playPauseText');
        this.playIcon = document.querySelector('.play-icon');
        this.pauseIcon = document.querySelector('.pause-icon');
        
        this.currentSlide = 0;
        this.isAutoPlaying = false;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 4000;
        
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }
    
    init() {
        this.createDots();
        this.attachEventListeners();
        this.updateSlider();
    }
    
    createDots() {
        this.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
        this.dots = document.querySelectorAll('.dot');
    }
    
    attachEventListeners() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        this.playPauseBtn.addEventListener('click', () => this.toggleAutoPlay());
        
        const slider = document.querySelector('.slider');
        slider.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        slider.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
        
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isAutoPlaying) {
                this.stopAutoPlay();
                this.wasAutoPlayingBeforeHidden = true;
            } else if (!document.hidden && this.wasAutoPlayingBeforeHidden) {
                this.startAutoPlay();
                this.wasAutoPlayingBeforeHidden = false;
            }
        });
    }
    
    updateSlider() {
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });
        
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlider();
        
        if (this.isAutoPlaying) {
            this.resetAutoPlay();
        }
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlider();
        
        if (this.isAutoPlaying) {
            this.resetAutoPlay();
        }
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateSlider();
        
        if (this.isAutoPlaying) {
            this.resetAutoPlay();
        }
    }
    
    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
    }
    
    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
    
    handleKeyPress(e) {
        if (e.key === 'ArrowLeft') {
            this.prevSlide();
        } else if (e.key === 'ArrowRight') {
            this.nextSlide();
        } else if (e.key === ' ') {
            e.preventDefault();
            this.toggleAutoPlay();
        }
    }
    
    toggleAutoPlay() {
        if (this.isAutoPlaying) {
            this.stopAutoPlay();
        } else {
            this.startAutoPlay();
        }
    }
    
    startAutoPlay() {
        this.isAutoPlaying = true;
        this.autoPlayInterval = setInterval(() => this.nextSlide(), this.autoPlayDelay);
        
        this.playIcon.classList.add('hidden');
        this.pauseIcon.classList.remove('hidden');
        this.playPauseText.textContent = 'Pause';
    }
    
    stopAutoPlay() {
        this.isAutoPlaying = false;
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
        
        this.playIcon.classList.remove('hidden');
        this.pauseIcon.classList.add('hidden');
        this.playPauseText.textContent = 'Autoplay';
    }
    
    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ImageSlider();
});