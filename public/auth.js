try {
    const authData = JSON.parse(
        document.querySelector("[data-reviewdb-auth]").dataset.reviewdbAuth
    );
    console.log(authData);

    chrome.runtime.sendMessage({ type: "setUser", user: authData }, () => {
        document.body.textContent = "Successfully authorized. You can close this tab now.";
    });
} catch (e) {
    console.log(e);
    document.body.textContent = "An error occured while authorizing. Please try again later.";
}
