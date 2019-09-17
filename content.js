var initLog = "Activating 'Konscience for Facebook on Chrome'";
console.log(initLog);

/* Set all global @params here:*/
var hitsCounterThreshold = 5; //Recommended:5
var XPathToProfiles = "//*/tr/td[2]/div/div[2]/div/div/a";
var initDelayInMilliseconds = 5000; //Recommended:5000
var scrollDelayInMilliSeconds = 1000; //Recommended:1000
var scrollMagnitude = 1000; //Recommended:1000

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "clicked_browser_action") {
            // var firstHref = $("a[href^='http']").eq(0).attr("href");
            issueAlert("Redirecting to target page. Click 'OK' to proceed.");
            var currentHref = window.location.href;
            var relativePathToPage = "settings/?tab=people_and_other_pages";
            var targetHref = currentHref.concat(relativePathToPage);
            //https://www.facebook.com/<pageID>/settings/?tab=people_and_other_pages
            console.log("Attempting to load page: " + targetHref);
            chrome.runtime.sendMessage({ "message": "open_new_tab", "url": likesHref });
        }
    }
);

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "opened_new_tab") {
            console.log("New Tab was opened.")
            scrollTillEnd(false);
        }
    }
);

function scrollTillEnd(flag) {
    var x = 1, y = -1;
    var hitsCounter = 0;
    if (!flag) {
        setTimeout(function () {
            scrollTillEnd(true);
        }, initDelayInMilliseconds);
        return;
    }
    time = setInterval(function () {
        x = document.documentElement.scrollTop;
        document.documentElement.scrollTop += scrollMagnitude;
        y = document.documentElement.scrollTop;
        if (x == y) {
            hitsCounter += 1;
            if (hitsCounter > hitsCounterThreshold) {
                console.log("Scrolling complete.");
                clearInterval(time);
                issueAlert("Page fully loaded.\nClick 'OK' to download output file contaning usernames of Followers.");
                extractAllProfiles();
                closeCurrentTab();
            }
        }
        else {
            hitsCounter = 0;
        }
    }, scrollDelayInMilliSeconds);
}

function extractAllProfiles() {
    var extractedProfiles = []
    let items = getElementsByXPath(XPathToProfiles);
    var allEntries = "";
    for (var i = 0, size = items.length; i < size; i++) {
        // var profile = [items[i].textContent, items[i].getAttribute("href")];
        var profileName = items[i].textContent;
        var profileID = items[i].getAttribute("href");
        allEntries = allEntries.concat('{ name: "' + profileName + '", ID: "' + profileID + '" }, ');
        // extractedProfiles.push(profile)
    }
    console.log("Profile extraction complete.")
    // var myStrText = JSON.stringify(entry);
    saveText("konscience-extension-output.txt", allEntries, issueAlert);
}

function getElementsByXPath(xpath, parent) {
    let results = [];
    let query = document.evaluate(xpath, parent || document,
        null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0, length = query.snapshotLength; i < length; ++i) {
        results.push(query.snapshotItem(i));
    }
    return results;
}

function saveText(filename, text, whenDone) {
    var tempElem = document.createElement('a');
    tempElem.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    tempElem.setAttribute('download', filename);
    tempElem.click();
    console.log("Download attempt complete.")
    var raiseAlert = "Click 'OK' to close this Window."
    whenDone(raiseAlert);
}

function closeCurrentTab() {
    console.log("Tab termination message issued.")
    chrome.runtime.sendMessage({ "message": "close_current_tab" });
}

function issueAlert(msg) {
    console.log("RaisedAlert: " + msg)
    alert(msg);
}