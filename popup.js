document.addEventListener('DOMContentLoaded', function () {
  const startButton = document.getElementById('start');
  const stopButton = document.getElementById('stop');
  const countdownDisplay = document.getElementById('countdown');

  startButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.runtime.sendMessage({ action: "start", tabId: tabs[0].id });
    });
  });

  stopButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "stop" });
  });

  // Listen for countdown updates from background
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "updateCountdown") {
      countdownDisplay.textContent = message.countdown > 0
        ? `Next visit in: ${message.countdown}s`
        : `Stopped`;
    }
  });
});
