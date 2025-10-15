import { links } from "./variables.js";

let urls = links;

let currentIndex = 0;
let activeTabId = null;
let minNum = 209;
let maxNum = 230;
let countdown = 0;
let countdownInterval = null;

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function visitLink() {
  if (currentIndex >= urls.length) currentIndex = 0;
  if (activeTabId) {
    chrome.tabs.update(activeTabId, { url: urls[currentIndex] });
    currentIndex++;
  }
}

function startCountdown() {
  countdown = generateRandomNumber(minNum, maxNum);
  
  // Notify popup every second
  countdownInterval = setInterval(() => {
    countdown--;
    chrome.runtime.sendMessage({ action: "updateCountdown", countdown });
    chrome.action.setBadgeText({ text: countdown.toString() });
    chrome.action.setBadgeBackgroundColor({ color: "#cbcbcbff" });


    if (countdown <= 0) {
      clearInterval(countdownInterval);
      visitLink();
      startCountdown(); // Start again for next URL
    }
  }, 1000);
}

function stopCountdown() {
  clearInterval(countdownInterval);
  chrome.runtime.sendMessage({ action: "updateCountdown", countdown: 0 });
  chrome.action.setBadgeText({ text: "" });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "start" && message.tabId) {
    activeTabId = message.tabId;
    stopCountdown(); // reset if any running
    startCountdown();
  } else if (message.action === "stop") {
    stopCountdown();
  }
});
