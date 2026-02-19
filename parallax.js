// HAWKINS_LAB - DEPTH_PERCEPTION_SYSTEM
document.addEventListener('mousemove', (e) => {
    const xVal = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    const yVal = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);

    // Target elements: CV Cards
    const cards = document.querySelectorAll('.lab-card');
    cards.forEach((card, index) => {
        const tiltForce = 15 + (index * 2); // Varying depth per card
        const rotX = -yVal * tiltForce;
        const rotY = xVal * tiltForce;
        
        // Apply 3D Tilt and a slight "Shadow Dimension" float
        card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(20px)`;
        
        // Dynamic Glow following the mouse
        card.style.boxShadow = `${-rotY * 2}px ${rotX * 2}px 30px rgba(255, 0, 0, 0.2)`;
    });

    // Target elements: Section Headers
    const titles = document.querySelectorAll('.module-title');
    titles.forEach((title) => {
        const shiftX = xVal * 30;
        title.style.transform = `translateX(${shiftX}px) skew(-5deg)`;
    });
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