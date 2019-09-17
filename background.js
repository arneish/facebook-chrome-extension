function scrolla() {
    chrome.tabs.executeScript({ code: 'var x= document.documentElement.scrollTop; document.documentElement.scrollTop+=1; var y=document.documentElement.scrollTop; if(x==y){document.documentElement.scrollTop=0;}' });
}

// var time;
// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function (tab) {
    // Send a message to the active tab
    // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //     var activeTab = tabs[0];
    chrome.tabs.sendMessage(tab.id, { "message": "clicked_browser_action" });
    // });
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "open_new_tab") {
            chrome.tabs.create({ "url": request.url }, function (tab) {
                // var time = setInterval(function () {
                // chrome.tabs.executeScript(tab.id,
                //     {
                //         code: 'window.scrollBy(0, document.documentElement.scrollHeight);'
                //     }
                // );
                // }, 2000);
                // var c = "if (window.scrollY < (document.documentElement.scrollHeight - window.screen.availHeight)) {\
                //     window.scrollTo(0, document.documentElement.scrollHeight);\
                //     return true;\
                // } else {\
                //     window.scrollTo(0, 0);\
                //     return false;\
                // }"
                // var c = "var x= document.documentElement.scrollTop;\
                // document.documentElement.scrollTop+=1000;\
                // var y=document.documentElement.scrollTop;"
                // //chrome.tabs.executeScript(tab.id, { code: c });
                // //chrome.tabs.update(tab.id, {'url': 'javascript:document.documentElement.scrollTop+=1;'});
                // // var start = setInterval(function(){scrolla()},10);
                // setInterval(function () {
                //     chrome.tabs.executeScript(tab.id, { code: c });
                // }, 2000);
                // chrome.tabs.sendMessage(tab.id, {"message": "opened_new_tab"});
                // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                //     var activeTab = tabs[0];
                // chrome.tabs.sendMessage(tab.id, { "message": "opened_new_tab" });
                // });
                chrome.tabs.executeScript(tab.id, { file: "content.js" }, function () {
                    chrome.tabs.sendMessage(tab.id, { "message": "opened_new_tab" });
                });

            });
            // chrome.tabs.sendMessage(tab.id, { "message": "opened_new_tab" });

            //chrome.tabs.create({"url": "fb.com/arneish"});
            // chrome.tabs.getCurrent(function (tab) {
            //     console.log(tab.url);
            // }
            //);



            // time = setInterval(function () {
            //     chrome.tabs.executeScript(
            //         {
            //             code: 'window.scrollTo(0,document.documentElement.scrollHeight);'
            //         }
            //     );
            // }, 2000);
        }
    }
);

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "close_current_tab") {
            // chrome.tabs.getCurrent(function (tab) {
            //     chrome.tabs.remove(tab.id, function () { });
            // });
            chrome.tabs.getSelected(null, function (tab) {
                chrome.tabs.remove(tab.id);
            });
        }
    }
);

