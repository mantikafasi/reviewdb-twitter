const storage = () => chrome.storage.sync.get();

chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {
        if (sender.origin !== "https://twitter.com" && sender.origin !== "https://manti.vendicated.dev") {
            return;
        }
        console.log(request);
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
                }
                );
                break;
        }
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request);
        switch (request.type) {
            case "setToken":
                storage().then(data => {
                    data.token = request.token;
                    chrome.storage.sync.set(data);
                });
                sendResponse({ message: "Successfully authorized" });
                break;
        }
    }
);
