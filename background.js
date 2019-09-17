chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.sendMessage(tab.id, { "message": "clicked_browser_action" });
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "open_new_tab") {
            chrome.tabs.create({ "url": request.url }, function (tab) {
                chrome.tabs.executeScript(tab.id, { file: "content.js" }, function () {
                    chrome.tabs.sendMessage(tab.id, { "message": "opened_new_tab" });
                });

            });
        }
    }
);

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "close_current_tab") {
            chrome.tabs.getSelected(null, function (tab) {
                chrome.tabs.remove(tab.id);
            });
        }
    }
);