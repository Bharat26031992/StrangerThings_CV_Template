# Stranger Things Theme Portfolio

<img width="1815" height="842" alt="image" src="https://github.com/user-attachments/assets/d8d532df-cc47-44de-b1c8-5896b9816056" />

## Description

An immersive, interactive portfolio website styled as a classified government dossier with Stranger Things-inspired aesthetics and supernatural visual effects. This project combines retro 80s styling with modern web technologies to create an engaging, theme-park-like experience.

## Features

### 🎮 Interactive Elements
- **Psychic Cursor System** - Custom cursor with glowing effects that responds to user interaction
- **Parallax Scrolling** - 3D depth perception with mouse-tracking and mobile gyroscope support
- **"Upside Down" Mode** - Toggle inverted display with Vecna curse effects (red vignette, flicker animation)
- **Responsive Design** - Seamless experience across desktop and mobile devices

### 🎵 Audio Jukebox
- Multi-track playlist with international music (22+ tracks)
- Interactive audio controls with volume slider
- Real-time audio visualization and waveform display
- Spatial audio effects with Web Audio API (drone oscillators, filters, noise generation)

### 🎨 Visual Effects
- Retro CRT scan-line effect and film grain
- Color-coded section indicators (red, cyan, amber, purple, lime)
- Glitch animations and flickering text
- Dynamic box shadow and glow effects
- Canvas-based particle and ripple effects

### 📱 Mobile Support
- Touch-drag interaction for jukebox controls
- Device orientation (gyroscope) parallax effects
- Device motion sensor integration
- Touch-optimized UI

### 🔧 Technical Stack
- **HTML5** - Semantic markup with MathJax support for equations
- **CSS3** - Advanced animations, gradients, and perspective transforms
- **JavaScript** - Web Audio API, Motion/Orientation sensors, Canvas 2D
- **Fonts** - VT323 (monospace retro), Baskervville (serif)
- **External Libraries** - MathJax for mathematical notation

## File Structure

- **index.html** - Main portfolio page with classified dossier styling
- **jukebox.js** - Audio player with Web Audio effects engine
- **parallax.js** - 3D parallax scrolling system (mouse + gyroscope)
- **mobile.html** - Mobile-optimized version
- **README.md** - Project documentation

## Usage

1. Open `index.html` in a modern web browser
2. Move your mouse to trigger parallax effects
3. Press the play button to start the jukebox
4. Use the volume slider to adjust audio level
5. Click the "Upside Down" button to activate the Vecna curse effect
6. On mobile: Tilt your device to see gyroscope-based parallax effects

## Browser Requirements

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers supporting Web Audio API and Device Orientation events

## Theme Inspiration

This project draws aesthetic and functional inspiration from Netflix's "Stranger Things," featuring:
- Government classified document styling
- Hawkins Lab color palette
- 80s/90s nostalgic design
- Supernatural glitch effects
- Portal/Upside Down visual metaphors

## Notes

- Audio files (track1.mp3 - track22.mp3) must be provided separately
- Gyroscope features require HTTPS on mobile devices
- Best viewed on larger screens for full parallax effect
- Disable cursor in CSS for custom psychic cursor display
