window._audioCtx = new AudioContext();

const audio = document.querySelector("audio");
const gain = window._audioCtx.createGain();
const desser = window._audioCtx.createBiquadFilter();

desser.type = 'peaking';
desser.frequency.value = 6000;  // Target sibilant frequencies (4-8kHz)
desser.Q.value = 5;             // Moderate sharpness (1-10)
desser.gain.value = -12;  


gain.gain.value = 1; // Try 50% volume to test

const source = window._audioCtx.createMediaElementSource(audio);
source.connect(gain).connect(desser).connect(window._audioCtx.destination);

// Ensure AudioContext is resumed
document.addEventListener('click', () => {
  if (window._audioCtx.state === 'suspended') {
    window._audioCtx.resume(); // No await
  }
});

// Also resume on audio play
audio.addEventListener('play', async () => {
  if (window._audioCtx.state === 'suspended') {
    await window._audioCtx.resume();
  }
});