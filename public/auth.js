fetch(chrome.runtime.getURL("/authpage.html"))
    .then(r => r.text())
    .then(html => {
        document.body.insertAdjacentHTML("beforeend", html);
        authStatus = document.getElementById("authorizationStatus");

        try {
            const authData = JSON.parse(
                document.querySelector("[data-reviewdb-auth]").dataset.reviewdbAuth
            );

            chrome.runtime.sendMessage({ type: "setUser", user: authData }, () => {});
            authStatus.textContent = "Successfully authorized!";
        } catch (e) {
            console.error(e);
            authStatus.textContent = "An error occured while authorizing. Please try again later.";
        }
    });
