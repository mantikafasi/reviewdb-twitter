const getStorageData = () => chrome.storage.sync.get();
let onAuthorizeCallback;
const oauthCallback = new Promise(resolve => (onAuthorizeCallback = resolve));

chrome.runtime.onMessageExternal.addListener(async (request, sender, sendResponse) => {
    switch (sender.origin) {
        case "https://twitter.com":
        case "https://manti.vendicated.dev":
            break;
        default:
            return;
    }

    switch (request.type) {
        case "authorize": {
            chrome.tabs.create({
                url: "https://twitter.com/i/oauth2/authorize?response_type=code&client_id=SFVDakw2VVg3V2VrTVlNVkNTS0Y6MTpjaQ&redirect_uri=https://manti.vendicated.dev/api/reviewdb-twitter/auth&scope=tweet.read%20users.read%20offline.access&state=state&code_challenge=challenge&code_challenge_method=plain",
            });
            oauthCallback.then(user => {
                sendResponse(user);
            });
            break;
        }

        case "getUser": {
            const data = await getStorageData();
            sendResponse(data.user);
            break;
        }
        case "fetch": {
            const res = await fetch(request.url, request.options);

            const data = {
                status: res.status,
                ok: res.ok,
                ...(request.responseType === "json"
                    ? { json: await res.json() }
                    : { text: await res.text() }),
            };

            sendResponse(data);
        }
    }
});

// for some weird reason making this function async causes it to return undefined
// https://stackoverflow.com/a/74777631
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.type) {
        case "setUser": {
            getStorageData().then(data => {
                data.user = request.user;
                chrome.storage.sync.set(data);
                onAuthorizeCallback(request.user);
            });
            break;
        }
        case "getUser": {
            getStorageData().then(data => sendResponse(data.user));
            break;
        }
        case "authorize": {
            chrome.tabs.create({
                url: "https://twitter.com/i/oauth2/authorize?response_type=code&client_id=SFVDakw2VVg3V2VrTVlNVkNTS0Y6MTpjaQ&redirect_uri=https://manti.vendicated.dev/api/reviewdb-twitter/auth&scope=tweet.read%20users.read%20offline.access&state=state&code_challenge=challenge&code_challenge_method=plain",
            });
            oauthCallback.then(sendResponse);
            break;
        }
    }
    return true;
});
