const storage = () => chrome.storage.sync.get();
let onAuthorizeCallback;
const oauthCallback = new Promise(resolve => (onAuthorizeCallback = resolve));

chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
    if (
        sender.origin !== "https://twitter.com" &&
        sender.origin !== "https://manti.vendicated.dev"
    ) {
        return; // i think this is pretty unneccesary tbh but docs had it so...
    }
    switch (request.type) {
        case "getToken":
            storage().then(data => {
                console.log(data);
                sendResponse({ token: data.token });
            });
            break;
        case "setToken":
            storage().then(data => {
                data.token = request.token;
                chrome.storage.sync.set(data);
            });
            break;
        case "authorize":
            oauthCallback.then((user) => {
                sendResponse(user);
            });
            break;
        case "getUser":
            storage().then(data => {
                sendResponse(data.user);
            });
            break;
        case "fetch":
            fetch(request.url, request.options).then(res => {
                if (request.responseType === "json") {
                    res.json().then(json => {
                        sendResponse({
                            json: json,
                            status: res.status,
                            ok: res.ok,
                        });
                    });
                    return;
                } else {
                    res.text().then(text => {
                        sendResponse({
                            text: text,
                            status: res.status,
                            ok: res.ok,
                        });
                    });
                    return;
                }
            });
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.type) {
        case "setUser":
            storage().then(data => {
                data.user = request.user;
                chrome.storage.sync.set(data);
                onAuthorizeCallback(request.user);
            });
            break;
    }
});
