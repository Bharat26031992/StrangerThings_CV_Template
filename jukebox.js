// [ CLASSIFIED_AUDIO_TRANSCEIVER - RIFT & CRACKLE ENGINE ]

// 1. DATA ARCHIVE
const playlist = [
    { title: "Bhairav", file: "track1.mp3" },
    { title: "Kalawati", file: "track2.mp3" },
    { title: "Malkauns", file: "track3.mp3" },
    { title: "Yaman", file: "track4.mp3" },
    { title: "Bad Bitch", file: "track5.mp3" },
    { title: "Перепутала", file: "track6.mp3" },
    { title: "Acenda o farol", file: "track7.mp3" },
    { title: "O Descobridor Dos Sete Mares", file: "track8.mp3" },
    { title: "Amores Lejanos", file: "track9.mp3" },
    { title: "Mi Manera de querer", file: "track10.mp3" },
    { title: "Aja mahi", file: "track11.mp3" },
    { title: "خونه ی ما", file: "track12.mp3" },
    { title: "Vienna Calling", file: "track13.mp3" },
    { title: "Ciudad de la furia", file: "track14.mp3" },
    { title: "ВИРТУАЛЬНАЯ ЛЮБОВЬ", file: "track15.mp3" },
    { title: "Oye mi amor", file: "track16.mp3" },
    { title: "Come", file: "track17.mp3" },
    { title: "Mas que nada", file: "track18.mp3" },
    { title: "Ring my bell", file: "track19.mp3" },
    { title: "Soledad y el mar", file: "track20.mp3" },
    { title: "Take 5", file: "track21.mp3" },
    { title: "Babaji ki Booti", file: "track22.mp3" }
];

// 2. GLOBAL STATE
let currentTrackIndex = Math.floor(Math.random() * playlist.length);
const audio = new Audio();
audio.volume = 0.5;

let audioCtx, masterGain, droneOscs = [], riftFilter, lfo, riftNoise;
let isUpsideDown = false;
let isDisintegrated = false;
let ripples = [];

// 3. SYSTEM INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    const card = document.getElementById('jukebox-card');
    const header = document.getElementById('j-header');
    const trackText = document.getElementById('t-text');
    const volSlider = document.getElementById('vol');
    const playBtn = document.getElementById('play-btn') || document.querySelector('#jukebox-card button');
    const fxCanvas = document.getElementById('fx-canvas');
    const fCtx = fxCanvas.getContext('2d');

    // --- DRAGGING LOGIC (MOBILE + DESKTOP) ---
    let isDragging = false;
    let offset = { x: 0, y: 0 };

    function handleDragStart(clientX, clientY) {
        isDragging = true;
        
        // Fix for mobile: Calculate exact position before removing CSS constraints
        const rect = card.getBoundingClientRect();
        offset.x = clientX - rect.left;
        offset.y = clientY - rect.top;

        // Clear interfering mobile CSS
        card.style.transform = 'none';
        card.style.bottom = 'auto';
        card.style.right = 'auto';
        card.style.margin = '0';
        
        // Lock the card to the calculated position so it doesn't jump
        card.style.left = rect.left + 'px';
        card.style.top = rect.top + 'px';
    }

    function handleDragMove(clientX, clientY) {
        const pCursor = document.getElementById('psychic-cursor');
        if(pCursor) { 
            pCursor.style.left = clientX + 'px'; 
            pCursor.style.top = clientY + 'px'; 
        }

        if (!isDragging) return; 
        card.style.left = (clientX - offset.x) + 'px';
        card.style.top = (clientY - offset.y) + 'px';
    }

    function handleDragEnd() { isDragging = false; }

    // Desktop Mouse Events
    header.addEventListener('mousedown', (e) => handleDragStart(e.clientX, e.clientY));
    document.addEventListener('mousemove', (e) => handleDragMove(e.clientX, e.clientY));
    document.addEventListener('mouseup', handleDragEnd);

    // Mobile Touch Events - Updated with passive: false to lock screen scrolling
    header.addEventListener('touchstart', (e) => {
        handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
        e.preventDefault(); // Prevents the screen from scrolling when you grab the header
    }, {passive: false});
    
    document.addEventListener('touchmove', (e) => {
        if (isDragging) {
            e.preventDefault(); // Lock the screen scroll while dragging the UI
            handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, {passive: false});
    document.addEventListener('touchend', handleDragEnd);

    // --- SYNTH ENGINE ---
    function initAudio() {
        if (audioCtx) return;
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = audioCtx.createGain();
        
        // High-Energy Rift Filter (Sucks out the bass as you enter the rift)
        riftFilter = audioCtx.createBiquadFilter();
        riftFilter.type = "highpass";
        riftFilter.frequency.value = 10; 

        masterGain.connect(audioCtx.destination);
        masterGain.gain.value = 0.3;
    }

    function playDrone() {
        [40, 55, 110].forEach(f => {
            const osc = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            osc.type = 'sawtooth'; osc.frequency.value = f;
            g.gain.value = 0.02; osc.connect(g); g.connect(masterGain);
            osc.start(); droneOscs.push({osc, g});
        });
        lfo = audioCtx.createOscillator();
        lfo.frequency.value = 0.5;
        const lfoG = audioCtx.createGain(); lfoG.gain.value = 5;
        lfo.connect(lfoG); droneOscs.forEach(d => lfoG.connect(d.osc.frequency));
        lfo.start();
    }

    function playCrackle(intensity) {
        if (!audioCtx || intensity < 0.1) return;
        const duration = 0.005 + Math.random() * 0.02;
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(Math.random() * 1500, audioCtx.currentTime);
        g.gain.setValueAtTime(intensity * 0.08, audioCtx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(g); g.connect(masterGain);
        osc.start(); osc.stop(audioCtx.currentTime + duration);
    }

    function playRiftEnergy(active) {
        if (!audioCtx) return;
        if (active) {
            riftFilter.frequency.exponentialRampToValueAtTime(1600, audioCtx.currentTime + 2);
            
            const bufferSize = audioCtx.sampleRate * 2;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

            riftNoise = audioCtx.createBufferSource();
            riftNoise.buffer = buffer; riftNoise.loop = true;
            const riftGain = audioCtx.createGain();
            riftGain.gain.value = 0;
            riftGain.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 1);
            riftNoise.connect(riftGain); riftGain.connect(masterGain);
            riftNoise.start();
        } else {
            riftFilter.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 2);
            if (riftNoise) { try { riftNoise.stop(); } catch(e){} }
        }
    }

    // --- EXPOSED CONTROLS ---
    window.startSystem = function() {
        initAudio();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        document.getElementById('intro-container').style.display = 'none';
        card.style.display = 'block';
        playDrone();
        loadTrack(currentTrackIndex);
        requestAnimationFrame(animate);

        // Hover Psychic Resonance sound (desktop only)
        document.querySelectorAll('.lab-card, li, .pub-box, h1, h2, .btn-lab').forEach(el => {
            el.addEventListener('mouseenter', () => window.playHoverStatic());
        });
    };

    window.togglePlay = function() {
        if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
        if (audio.paused) {
            audio.play().then(() => {
                if(playBtn) playBtn.innerText = "PAUSE";
                trackText.innerText = `SIGNAL: ${playlist[currentTrackIndex].title.toUpperCase()}`;
            });
        } else {
            audio.pause();
            if(playBtn) playBtn.innerText = "PLAY";
            trackText.innerText = "SIGNAL: PAUSED";
        }
    };

    window.changeTrack = function(dir) {
        currentTrackIndex = (currentTrackIndex + dir + playlist.length) % playlist.length;
        loadTrack(currentTrackIndex);
        audio.play();
        if(playBtn) playBtn.innerText = "PAUSE";
    };

    window.shufflePlaylist = function() {
        currentTrackIndex = Math.floor(Math.random() * playlist.length);
        loadTrack(currentTrackIndex);
        audio.play();
        if(playBtn) playBtn.innerText = "PAUSE";
    };

    function loadTrack(index) {
        audio.src = playlist[index].file;
        trackText.innerText = `SIGNAL: ${playlist[index].title.toUpperCase()}`;
    }

    window.playHoverStatic = function() {
        if(!audioCtx) return;
        const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.05, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        const noise = audioCtx.createBufferSource();
        const g = audioCtx.createGain();
        g.gain.setValueAtTime(0.01, audioCtx.currentTime);
        noise.buffer = buffer; noise.connect(g); g.connect(masterGain); noise.start();
    }

    // --- PHYSICS & ANIMATION (MOBILE + DESKTOP) ---
    function createRipple(clientX, clientY, target) {
        if(target && target.closest('#jukebox-card, button, a')) return;
        ripples.push({ x: clientX, y: clientY, r: 0, maxR: 750, speed: 18, opacity: 1 });
        window.playHoverStatic();
    }

    window.addEventListener('mousedown', (e) => createRipple(e.clientX, e.clientY, e.target));
    window.addEventListener('touchstart', (e) => createRipple(e.touches[0].clientX, e.touches[0].clientY, e.target), {passive: true});

    function animate() {
        fxCanvas.width = window.innerWidth; fxCanvas.height = window.innerHeight;
        fCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
        
        ripples.forEach((r, i) => {
            r.r += r.speed; r.opacity -= 0.015;
            if(r.opacity <= 0) ripples.splice(i, 1);
            else {
                fCtx.beginPath();
                for(let a=0; a<Math.PI*2; a+=0.1) {
                    const waveDist = r.r + Math.sin(a*15 + r.r/10)*20;
                    fCtx.lineTo(r.x + Math.cos(a)*waveDist, r.y + Math.sin(a)*waveDist);
                }
                fCtx.strokeStyle = `rgba(0, 242, 255, ${r.opacity})`; fCtx.lineWidth = 6; fCtx.stroke();
                
                // SHOCKWAVE IMPACT PHYSICS
                const jRect = card.getBoundingClientRect();
                const dist = Math.sqrt(Math.pow(r.x - (jRect.left + jRect.width/2), 2) + Math.pow(r.y - (jRect.top + jRect.height/2), 2));
                if(Math.abs(dist - r.r) < 40 && !isDisintegrated) {
                    triggerImpact();
                }
            }
        });
        requestAnimationFrame(animate);
    }

    function triggerImpact() {
        isDisintegrated = true;
        const osc = audioCtx.createOscillator(); const g = audioCtx.createGain();
        osc.type = 'square'; osc.frequency.value = 400; g.gain.value = 0.1;
        osc.connect(g); g.connect(masterGain); osc.start(); osc.stop(audioCtx.currentTime + 0.1);
        
        card.style.opacity = "0"; card.style.filter = "blur(30px) brightness(5)";
        setTimeout(() => {
            card.style.left = (Math.random() * (window.innerWidth - 300)) + "px";
            card.style.top = (Math.random() * (window.innerHeight - 300)) + "px";
            setTimeout(() => { card.style.opacity = "1"; card.style.filter = "none"; isDisintegrated = false; }, 500);
        }, 600);
    }

    // --- SCROLL & CRACKLE ENGINE ---
    window.addEventListener('scroll', () => {
        const totalHeight = document.body.offsetHeight - window.innerHeight;
        if(totalHeight <= 0) return; // Prevent division by 0 on very short screens
        
        const progress = window.scrollY / totalHeight;

        if (Math.random() < progress * 0.35) {
            playCrackle(progress);
        }

        const atBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 15;
        const atTop = window.scrollY <= 10;
        
        if (atBottom && !isUpsideDown) {
            isUpsideDown = true;
            document.body.classList.add('vecna-curse');
            const msg = document.getElementById('upside-down-msg');
            if(msg) msg.style.display = 'block';
            playRiftEnergy(true);
        } 
        if (atTop && isUpsideDown) {
            isUpsideDown = false;
            document.body.classList.remove('vecna-curse');
            const msg = document.getElementById('upside-down-msg');
            if(msg) msg.style.display = 'none';
            playRiftEnergy(false);
        }
    });

    volSlider.oninput = (e) => {
        audio.volume = e.target.value;
        if(masterGain) masterGain.gain.value = e.target.value;
    };
});