const script = document.createElement("script");
script.src = chrome.runtime.getURL("bundle.js");
document.documentElement.append(script);

const style = document.createElement("link");
style.type = "text/css";
style.rel = "stylesheet";
style.href = browser.runtime.getURL("bundle.css");

document.documentElement.append(script);

document.addEventListener("DOMContentLoaded", () => document.documentElement.append(style), {
    once: true,
});
