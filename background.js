chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === "complete" && !tab.url.startsWith("chrome://")) {
        chrome.tabs.sendMessage(tabId, {
            type: "NEW"
        });
    }
});

