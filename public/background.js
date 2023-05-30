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
        case "getToken": {
            const data = await getStorageData();
            console.log(data);
            sendResponse({ token: data.token });
            break;
        }
        case "setToken": {
            const data = await getStorageData();
            data.token = request.token;
            chrome.storage.sync.set(data);
            break;
        }
        case "authorize": {
            sendResponse(await oauthCallback);
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

chrome.runtime.onMessage.addListener(async request => {
    switch (request.type) {
        case "setUser": {
            const data = await getStorageData();
            data.user = request.user;
            chrome.storage.sync.set(data);
            onAuthorizeCallback(request.user);
            break;
        }
    }
});
