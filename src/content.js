let isEQOn = false;

document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("toggleButton");

  toggleButton.style.backgroundColor = "#FF474C";
  toggleButton.textContent = "Off";

  toggleButton.addEventListener("click", () => {
    isEQOn = !isEQOn;

    toggleButton.textContent = isEQOn ? "On" : "Off";
    toggleButton.style.backgroundColor = isEQOn ? "#88E788" : "#FF474C";

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: toggleMuteScript,
        args: [isEQOn]
      });
    });
  });
});

// This is injected into the current page
function toggleMuteScript(shouldMute) {
  if (!window._audioCtx) {
    window._audioCtx = new AudioContext();
    window._gainNode = window._audioCtx.createGain();
    window._gainNode.gain.value = 1;

    const mediaElements = document.querySelectorAll("audio, video");

    mediaElements.forEach((el) => {
      try {
        const source = window._audioCtx.createMediaElementSource(el);
        source.connect(window._gainNode).connect(window._audioCtx.destination);
      } catch (e) {
        // already connected or not valid
      }
    });
  }

  window._gainNode.gain.value = shouldMute ? 0 : 1;

  if (window._audioCtx.state === "suspended") {
    window._audioCtx.resume();
  }
}
