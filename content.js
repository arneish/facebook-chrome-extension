var initLog = "Activating 'Konscience for Facebook on Chrome'";
console.log(initLog);

/* Set all global @params here:*/
var emailAddress = "arneish.p@gmail.com";
var outputFileName = "konscience-output.txt";
var relativePathToPage = "settings/?tab=people_and_other_pages";
var hitsCounterThreshold = 10; //Recommended:10
var initDelayInMilliseconds = 5000; //Recommended:5000
var scrollDelayInMilliSeconds = 1000; //Recommended:1000
var scrollMagnitude = 1000; //Recommended:1000
var XPathToProfiles = "//*/tr/td[2]/div/div[2]/div/div/a";

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "clicked_browser_action") {
            // var firstHref = $("a[href^='http']").eq(0).attr("href");
            var currentHref = window.location.href;
            var targetHref = getTargetHref(currentHref);
            issueAlert("Redirecting to target page. Click 'OK' to proceed.");
            //https://www.facebook.com/<pageID>/settings/?tab=people_and_other_pages
            console.log("Attempting to load page: " + targetHref);
            chrome.runtime.sendMessage({ "message": "open_new_tab", "url": targetHref });
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
                issueAlert("Page loaded successfully.\n\nClick 'OK' to download output file contaning usernames.");
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
    saveText(outputFileName, allEntries, issueAlert);
}

function getTargetHref(firstHref) {
    var targetHref = '';
    var matchOne = firstHref.match(/https:\/\/www.facebook.com\/pg\/\w+\//);
    if (matchOne) { //matches 'https://www.facebook.com/pg/<page>/'
        targetHref = matchOne[0].substr(0, 25) + matchOne[0].substr(28) + relativePathToPage
    }
    else { //must match 'https://www.facebook.com/<page>/'
        var matchTwo = firstHref.match(/https:\/\/www.facebook.com\/\w+\//);
        targetHref = matchTwo[0] + relativePathToPage
    }
    return targetHref
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
    var raiseAlert = "E-mail the downloaded file at: " + emailAddress + "\n\nKonscience for Facebook on Chrome can now safely be disabled from 'chrome://extensions'.\n\nTo repeat the extraction process, reload the Page and click the Konscience icon on the Extensions bar.\n\nClick 'OK' to close this Tab."
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