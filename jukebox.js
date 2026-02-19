// [ CLASSIFIED_AUDIO_TRANSCEIVER_V3 ]
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

let currentTrackIndex = Math.floor(Math.random() * playlist.length);
const audio = new Audio();
audio.volume = 0.5;

document.addEventListener('DOMContentLoaded', () => {
    const card = document.getElementById('jukebox-card');
    const header = document.querySelector('#jukebox-card div:first-child');
    const trackText = document.getElementById('track-text');
    const volSlider = document.getElementById('vol');

    // --- DRAGGING LOGIC ---
    let isDragging = false;
    let offset = { x: 0, y: 0 };

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offset.x = e.clientX - card.offsetLeft;
        offset.y = e.clientY - card.offsetTop;
        card.style.transition = "none";
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        card.style.left = (e.clientX - offset.x) + 'px';
        card.style.top = (e.clientY - offset.y) + 'px';
        card.style.bottom = "auto";
    });

    document.addEventListener('mouseup', () => isDragging = false);

    // --- MUSIC CONTROLS ---
    window.togglePlay = function() {
        if (audio.paused) {
            audio.play().catch(() => console.log("Interaction required"));
            trackText.innerText = `SIGNAL: ${playlist[currentTrackIndex].title.toUpperCase()}`;
        } else {
            audio.pause();
            trackText.innerText = "SIGNAL: PAUSED";
        }
    };

    window.changeTrack = function(dir) {
        currentTrackIndex = (currentTrackIndex + dir + playlist.length) % playlist.length;
        loadTrack(currentTrackIndex);
        audio.play();
    };

    function loadTrack(index) {
        audio.src = playlist[index].file;
        trackText.innerText = `SIGNAL: ${playlist[index].title.toUpperCase()}`;
    }

    if (volSlider) {
        volSlider.oninput = (e) => audio.volume = e.target.value;
        volSlider.onmousedown = (e) => e.stopPropagation(); // Prevents dragging card while sliding volume
    }

    loadTrack(currentTrackIndex);
});