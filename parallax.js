// HAWKINS_LAB - DEPTH_PERCEPTION_SYSTEM

// Central function to apply the tilt effect
function applyParallax(xVal, yVal) {
    // Target elements: CV Cards
    const cards = document.querySelectorAll('.lab-card');
    cards.forEach((card, index) => {
        const tiltForce = 15 + (index * 2); // Varying depth per card
        const rotX = -yVal * tiltForce;
        const rotY = xVal * tiltForce;
        
        // Apply 3D Tilt and a slight "Shadow Dimension" float
        card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(20px)`;
        
        // Dynamic Glow
        card.style.boxShadow = `${-rotY * 2}px ${rotX * 2}px 30px rgba(255, 0, 0, 0.2)`;
    });

    // Target elements: Section Headers
    const titles = document.querySelectorAll('.module-title');
    titles.forEach((title) => {
        const shiftX = xVal * 30;
        title.style.transform = `translateX(${shiftX}px) skew(-5deg)`;
    });
}

// 1. DESKTOP MOUSE SUPPORT
document.addEventListener('mousemove', (e) => {
    const xVal = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    const yVal = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    applyParallax(xVal, yVal);
});

// 2. MOBILE GYROSCOPE SUPPORT
window.addEventListener('deviceorientation', (e) => {
    if (!e.gamma || !e.beta) return; // Prevent errors on desktop

    // e.gamma represents left-to-right tilt in degrees (-90 to 90)
    // e.beta represents front-to-back tilt in degrees (-180 to 180)
    let xVal = e.gamma / 45; // Normalize so 45 deg tilt is maximum effect
    let yVal = (e.beta - 45) / 45; // Offset beta assuming user holds phone at a 45 deg angle naturally
    
    // Clamp the values to ensure the elements don't flip completely inside out
    xVal = Math.max(-1, Math.min(1, xVal));
    yVal = Math.max(-1, Math.min(1, yVal));

    applyParallax(xVal, yVal);
});

// Periodic "Reality Glitch" Effect
setInterval(() => {
    const cards = document.querySelectorAll('.lab-card');
    const target = cards[Math.floor(Math.random() * cards.length)];
    if (target) {
        target.style.filter = "invert(0.1) sepia(1) saturate(5) hue-rotate(-50deg)";
        setTimeout(() => target.style.filter = "none", 100);
    }
}, 4000);