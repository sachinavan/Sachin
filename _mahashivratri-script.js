// =============================================
// MAHASHIVRATRI SPECIAL - ADVANCED JAVASCRIPT
// =============================================

class MahashivratriAnimation {
    constructor() {
        this.flowerEmojis = ['🌹', '🌺', '🌸', '🌼', '🌻', '💐', '🏵️', '🌷', '✿', '❀'];
        this.isFullscreen = false;
        this.animationStarted = false;
        this.particleSystem = [];
        this.soundEnabled = true;
        this.init();
    }

    // =============================================
    // INITIALIZATION
    // =============================================

    init() {
        console.log('🕉️ Initializing Mahashivratri Animation...');
        this.setupEventListeners();
        this.createBackgroundImage();
        this.startAnimation();
        this.initParticleSystem();
        this.addBackgroundMusic();
        this.setupTouchControls();
    }

    // =============================================
    // BACKGROUND IMAGE SETUP
    // =============================================

    createBackgroundImage() {
        const mainContainer = document.querySelector('.main-container');
        
        // Create background image layer
        const bgImage = document.createElement('div');
        bgImage.className = 'bg-image-layer';
        bgImage.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920"><defs><radialGradient id="grad1" cx="50%" cy="50%" r="50%"><stop offset="0%" style="stop-color:rgb(255,165,0);stop-opacity:1" /><stop offset="100%" style="stop-color:rgb(30,58,138);stop-opacity:1" /></radialGradient></defs><rect width="1080" height="1920" fill="url(%23grad1)"/></svg>') center/cover;
            opacity: 0.15;
            z-index: 2;
            pointer-events: none;
        `;
        
        // Add a canvas-based dynamic background
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 3;
            opacity: 0.3;
            pointer-events: none;
        `;
        
        mainContainer.insertBefore(canvas, mainContainer.firstChild);
        mainContainer.insertBefore(bgImage, mainContainer.firstChild);
        
        this.drawDynamicBackground(canvas);
        window.addEventListener('resize', () => this.drawDynamicBackground(canvas));
    }

    drawDynamicBackground(canvas) {
        const ctx = canvas.getContext('2d');
        const time = Date.now() * 0.0005;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw animated waves
        for (let i = 0; i < 5; i++) {
            ctx.strokeStyle = `rgba(255, 165, 0, ${0.1 - i * 0.02})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            for (let x = 0; x < canvas.width; x += 20) {
                const y = canvas.height / 2 + Math.sin(x * 0.005 + time + i) * 50 + i * 30;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        
        // Continue animation
        requestAnimationFrame(() => this.drawDynamicBackground(canvas));
    }

    // =============================================
    // FLOWER ANIMATION SYSTEM
    // =============================================

    startAnimation() {
        console.log('🌸 Starting flower animation...');
        this.createFlowerRain();
        
        // Start continuous flower rain
        setInterval(() => this.createFlowerRain(), 2000);
        
        // Start deities animation sequence
        this.animateDeities();
        
        // Add sparkles
        this.createSparkles();
        
        // Start wedding animation
        setTimeout(() => this.startWeddingAnimation(), 4500);
    }

    createFlowerRain() {
        const container = document.getElementById('flowersContainer');
        const flowerCount = window.innerWidth > 768 ? 40 : 20;
        
        for (let i = 0; i < flowerCount; i++) {
            const flower = document.createElement('div');
            flower.className = 'flower';
            
            const emoji = this.flowerEmojis[Math.floor(Math.random() * this.flowerEmojis.length)];
            const span = document.createElement('span');
            span.textContent = emoji;
            flower.appendChild(span);
            
            const startX = Math.random() * window.innerWidth;
            const startY = -100;
            const endX = startX + (Math.random() - 0.5) * 400;
            const duration = 4 + Math.random() * 5;
            const delay = Math.random() * 2;
            const rotation = Math.random() * 720;
            const size = 20 + Math.random() * 40;
            
            flower.style.cssText = `
                left: ${startX}px;
                top: ${startY}px;
                font-size: ${size}px;
                --duration: ${duration}s;
                --delay: ${delay}s;
                --rotation: ${rotation}deg;
                --end-x: ${endX}px;
                --end-y: ${window.innerHeight}px;
            `;
            
            container.appendChild(flower);
            
            // Animate flower
            setTimeout(() => {
                flower.style.transition = `all ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
                flower.style.left = endX + 'px';
                flower.style.top = window.innerHeight + 'px';
                flower.style.opacity = '0';
                flower.style.transform = `rotate(${rotation}deg) scale(0.3)`;
            }, delay * 1000);
            
            // Remove flower after animation
            setTimeout(() => flower.remove(), (duration + delay) * 1000);
        }
    }

    // =============================================
    // DEITY ANIMATION
    // =============================================

    animateDeities() {
        const deityContainer = document.getElementById('deityContainer');
        const shiva = document.getElementById('shiva');
        const parvati = document.getElementById('parvati');
        
        // Trigger fade-in animations
        setTimeout(() => {
            deityContainer.style.animation = 'appearDeities 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
        }, 1500);
        
        // Add glow effects
        this.addGlowEffect(shiva, '#ffd700');
        this.addGlowEffect(parvati, '#ff69b4');
        
        // Add floating animation
        this.startFloatingAnimation(shiva, parvati);
    }

    addGlowEffect(element, color) {
        const glow = document.createElement('div');
        glow.style.cssText = `
            position: absolute;
            inset: -20px;
            border-radius: 50%;
            background: radial-gradient(circle, ${color}44 0%, transparent 70%);
            pointer-events: none;
            animation: pulseGlow 2s ease-in-out infinite;
        `;
        
        element.style.position = 'relative';
        element.appendChild(glow);
    }

    startFloatingAnimation(shiva, parvati) {
        let direction = 1;
        let offset = 0;
        
        const float = () => {
            offset += direction * 0.5;
            if (Math.abs(offset) > 30) direction *= -1;
            
            shiva.style.transform = `translateY(${offset}px)`;
            parvati.style.transform = `translateY(${offset}px)`;
            
            requestAnimationFrame(float);
        };
        
        float();
    }

    // =============================================
    // SPARKLE SYSTEM
    // =============================================

    createSparkles() {
        const container = document.getElementById('deityContainer');
        
        // Create initial sparkles
        for (let i = 0; i < 50; i++) {
            this.addSparkle(container);
        }
        
        // Add new sparkles periodically
        setInterval(() => this.addSparkle(container), 500);
    }

    addSparkle(container) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        
        const x = (Math.random() - 0.5) * 600;
        const y = (Math.random() - 0.5) * 400;
        const size = Math.random() * 8 + 2;
        const duration = Math.random() * 2 + 1;
        const delay = Math.random() * 2;
        
        sparkle.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            animation: sparkleGlow ${duration}s ease-in-out ${delay}s forwards;
            opacity: 0;
        `;
        
        container.appendChild(sparkle);
        
        // Remove sparkle after animation
        setTimeout(() => sparkle.remove(), (duration + delay) * 1000);
    }

    // =============================================
    // WEDDING ANIMATION
    // =============================================

    startWeddingAnimation() {
        console.log('💒 Starting wedding celebration...');
        const weddingText = document.getElementById('weddingText');
        
        // Pulse animation for wedding text
        weddingText.style.animation = 'weddingPulse 1s ease-in-out infinite';
        
        // Create confetti
        this.createConfetti();
        
        // Play wedding sounds
        this.playWeddingChant();
        
        // Add hearts
        this.createHearts();
    }

    createConfetti() {
        const container = document.getElementById('flowersContainer');
        const confetti = ['🎊', '💕', '✨', '🌺', '🎉', '💐', '🌹', '💖'];
        
        for (let i = 0; i < 100; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti';
            piece.textContent = confetti[Math.floor(Math.random() * confetti.length)];
            
            const x = Math.random() * window.innerWidth;
            const y = -50;
            const duration = 3 + Math.random() * 3;
            const delay = Math.random() * 0.5;
            const rotation = Math.random() * 720;
            
            piece.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                font-size: ${20 + Math.random() * 30}px;
                opacity: 1;
                pointer-events: none;
                animation: confettiFall ${duration}s linear ${delay}s forwards;
            `;
            
            container.appendChild(piece);
            
            // Clean up
            setTimeout(() => piece.remove(), (duration + delay) * 1000);
        }
    }

    createHearts() {
        const container = document.getElementById('deityContainer');
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.textContent = '💕';
                heart.style.cssText = `
                    position: absolute;
                    font-size: ${20 + Math.random() * 30}px;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    animation: floatHeart ${3 + Math.random() * 2}s ease-in forwards;
                    opacity: 0;
                `;
                
                container.appendChild(heart);
                setTimeout(() => heart.remove(), 5000);
            }, i * 100);
        }
    }

    // =============================================
    // PARTICLE SYSTEM
    // =============================================

    initParticleSystem() {
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 4;
        `;
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw particles
            this.particleSystem.forEach((p, i) => {
                p.update();
                p.draw(ctx);
                
                if (p.life <= 0) {
                    this.particleSystem.splice(i, 1);
                }
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
        
        // Add particles on click
        document.addEventListener('click', (e) => {
            this.createParticles(e.clientX, e.clientY);
        });
    }

    createParticles(x, y) {
        const colors = ['#ffd700', '#ff69b4', '#ff6347', '#ffa500'];
        
        for (let i = 0; i < 15; i++) {
            const angle = (Math.PI * 2 * i) / 15;
            const velocity = {
                x: Math.cos(angle) * 3,
                y: Math.sin(angle) * 3
            };
            
            this.particleSystem.push(new Particle(x, y, velocity, colors[Math.floor(Math.random() * colors.length)]));
        }
    }

    // =============================================
    // AUDIO & SOUND EFFECTS
    // =============================================

    addBackgroundMusic() {
        // Create audio context
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Add mute button
        const muteBtn = document.createElement('button');
        muteBtn.innerHTML = '🔊';
        muteBtn.className = 'sound-toggle';
        muteBtn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: rgba(255, 215, 0, 0.8);
            border: 2px solid #ffd700;
            color: #000;
            font-size: 24px;
            cursor: pointer;
            z-index: 100;
            transition: all 0.3s ease;
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
        `;
        
        muteBtn.addEventListener('mouseover', () => {
            muteBtn.style.transform = 'scale(1.1)';
            muteBtn.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.8)';
        });
        
        muteBtn.addEventListener('mouseout', () => {
            muteBtn.style.transform = 'scale(1)';
            muteBtn.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.6)';
        });
        
        muteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.soundEnabled = !this.soundEnabled;
            muteBtn.innerHTML = this.soundEnabled ? '🔊' : '🔇';
        });
        
        document.body.appendChild(muteBtn);
    }

    playWeddingChant() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        try {
            const now = this.audioContext.currentTime;
            const notes = [261.63, 329.63, 392.00, 523.25]; // C, E, G, C
            
            notes.forEach((freq, i) => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                
                osc.connect(gain);
                gain.connect(this.audioContext.destination);
                
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
                
                osc.start(now + i * 0.2);
                osc.stop(now + i * 0.2 + 0.5);
            });
        } catch (e) {
            console.log('Audio context not available');
        }
    }

    // =============================================
    // FULLSCREEN FUNCTIONALITY
    // =============================================

    requestFullScreen() {
        const elem = document.documentElement;
        
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => console.log(err));
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
        
        this.isFullscreen = true;
    }

    setupEventListeners() {
        // Click for fullscreen
        document.addEventListener('click', () => {
            if (!this.isFullscreen && !this.animationStarted) {
                this.requestFullScreen();
                this.animationStarted = true;
            }
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.key === 'f' || e.key === 'F') {
                this.requestFullScreen();
            } else if (e.key === 'Escape') {
                this.isFullscreen = false;
                document.exitFullscreen?.();
            } else if (e.key === 'm' || e.key === 'M') {
                this.soundEnabled = !this.soundEnabled;
                const btn = document.querySelector('.sound-toggle');
                if (btn) btn.innerHTML = this.soundEnabled ? '🔊' : '🔇';
            }
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Prevent right-click
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }

    // =============================================
    // TOUCH CONTROLS
    // =============================================

    setupTouchControls() {
        let touchStartX = 0;
        let touchStartY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            this.requestFullScreen();
        }, false);
        
        document.addEventListener('touchmove', (e) => {
            const touchEndX = e.touches[0].clientX;
            const touchEndY = e.touches[0].clientY;
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;
            
            // Swipe detected
            if (Math.abs(diffX) > 50 || Math.abs(diffY) > 50) {
                this.createParticles(touchEndX, touchEndY);
            }
        }, false);
    }

    handleResize() {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    }

    // =============================================
    // UTILITY METHODS
    // =============================================

    log(message) {
        console.log(`🕉️ ${message}`);
    }
}

// =============================================
// PARTICLE CLASS
// =============================================

class Particle {
    constructor(x, y, velocity, color) {
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.color = color;
        this.life = 1;
        this.size = Math.random() * 4 + 2;
        this.gravity = 0.1;
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.velocity.y += this.gravity;
        this.life -= 0.02;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.life;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// =============================================
// ADD MISSING CSS ANIMATIONS
// =============================================

function addMissingAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulseGlow {
            0%, 100% {
                transform: scale(1);
                opacity: 0.5;
            }
            50% {
                transform: scale(1.1);
                opacity: 0.8;
            }
        }

        @keyframes confettiFall {
            0% {
                transform: translateY(0) rotateZ(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotateZ(720deg);
                opacity: 0;
            }
        }

        @keyframes floatHeart {
            0% {
                opacity: 1;
                transform: translateY(0) scale(0);
            }
            50% {
                opacity: 1;
                transform: translateY(-100px) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateY(-200px) scale(0.5);
            }
        }

        @keyframes weddingPulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.15);
            }
        }

        .sound-toggle:active {
            transform: scale(0.9);
        }
    `;
    document.head.appendChild(style);
}

// =============================================
// INITIALIZATION ON DOCUMENT LOAD
// =============================================

window.addEventListener('DOMContentLoaded', () => {
    console.log('🕉️ Mahashivratri Animation Loading...');
    addMissingAnimations();
    const animation = new MahashivratriAnimation();
    console.log('✨ Animation Ready!');
});

// Handle page visibility
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden');
    } else {
        console.log('Page visible');
    }
});

// Prevent accidental navigation
window.addEventListener('beforeunload', (e) => {
    if (confirm('Are you sure you want to leave the Mahashivratri celebration?')) {
        return true;
    }
    e.preventDefault();
});