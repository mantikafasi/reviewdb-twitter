document.addEventListener("DOMContentLoaded", function () {
    chrome.runtime.sendMessage({ type: "getUser" }, user => {
        if (user) {
            document.getElementById("avatar").src = user.avatarURL;
            document.getElementById("username").textContent = `@${user.username}`;
            document.getElementById("displayName").textContent = user.displayName;
        } else {
            document.getElementById("userInfo").style.display = "none";
            document.getElementById("notLoggedInText").style.display = "block";
            document.getElementById("authorizeButton").textContent = "Authorize";
        }
        document.getElementById("authorizeButton").addEventListener("click", function () {
            chrome.runtime.sendMessage({ type: "authorize" });
        });
    });
});
