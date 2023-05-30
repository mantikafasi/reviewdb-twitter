const script = document.createElement("script");
script.src = chrome.runtime.getURL("bundle.js");
script.id = "review-db-script";
script.dataset.extensionId = chrome.runtime.id;
document.documentElement.append(script);

const style = document.createElement("link");
style.type = "text/css";
style.rel = "stylesheet";
style.href = chrome.runtime.getURL("bundle.css");

document.documentElement.append(script);

document.addEventListener("DOMContentLoaded", () => document.documentElement.append(style), {
    once: true,
});
