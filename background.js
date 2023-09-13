chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === "complete" && !tab.url.startsWith("chrome://")) {
        getBaseUrl((cURL) => {
            chrome.tabs.sendMessage(tabId, {
                type: "NEW",
                passwordFields: [], // document.querySelectorAll('input[type="password"]')
                current_base_url: cURL
            });
        });
    }
});

async function getBaseUrl(callback) { // with sync and async support
    if (callback && typeof callback === 'function') {
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            const url = new URL(await tabs[0].url);
            const cURL = url.hostname;
            callback(cURL);
        });
    } else {
        return new Promise(async (resolve) => {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            const url = new URL(await tabs[0].url);
            const cURL = url.hostname;
            resolve(cURL);
        });
    }
}
