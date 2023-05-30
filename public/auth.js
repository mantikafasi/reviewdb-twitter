try {
    response = JSON.parse(document.body.innerText);

    const browser = chrome || browser;

    browser.runtime.sendMessage({ type: "setUser", user: response }, function (response) {
        document.body.innerHTML = "Successfully authorized. You can close this tab now.";
    });
} catch (e) {
    console.log(e);
    document.body.innerHTML = "An error occured while authorizing. Please try again later.";
}
