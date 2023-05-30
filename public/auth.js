response = document.body.innerText;

const browser = chrome || browser;

browser.runtime.sendMessage({ type: "setToken", token: "response.token" }, function (response) {
    document.body.innerText = response.message;
});
