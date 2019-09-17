// alert("Hello from your Chrome extension!")
var str = "Konscience for Facebook on Chrome";
var hitsCounterThreshold = 20;
console.log(str);
// var firstHref = $("a[href^='http']").eq(0).attr("href");
// console.log(firstHref);
function saveText(filename, text) {
    var tempElem = document.createElement('a');
    tempElem.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    tempElem.setAttribute('download', filename);
    tempElem.click();
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


function extractAllProfiles() {
    // const fs = require('fs');
    var extractedProfiles = []
    XPathToProfiles = "//*/tr/td[2]/div/div[2]/div/div/a";
    let items = getElementsByXPath(XPathToProfiles);
    var entry = "";
    // var os = require('os');
    for (var i = 0, size = items.length; i < size; i++) {
        // var profile = [items[i].textContent, items[i].getAttribute("href")];
        var profileName = items[i].textContent;
        var profileID = items[i].getAttribute("href");
        entry = entry.concat(profileName, ',', profileID, ';');
        // fs.writeFile('Output.txt', entry, (err) => {
        //     if(err) throw err;
        // });
        // extractedProfiles.push(profile)
        // alert(profileName);
    }
    var myStrText = JSON.stringify(entry);
    saveText("konscience-extension-output.txt", myStrText);
}









function scrollTillEnd(flag) {
    var x = 1, y = -1;
    var delayInMilliseconds = 5000; //1 second
    var hitsCounter = 0;
    if (!flag) {
        setTimeout(function () {
            // alert("Set TimeOut!");/100006864103999
            scrollTillEnd(true);
        }, delayInMilliseconds);
        return;
    }

    time = setInterval(function () {
        x = document.documentElement.scrollTop;
        document.documentElement.scrollTop += 1000;
        y = document.documentElement.scrollTop;
        if (x == y) {
            hitsCounter += 1;
            if (hitsCounter > hitsCounterThreshold) {
                console.log("again clearing time");
                clearInterval(time);
                alert("All Followers accessed.\nPopulating Records...");
                extractAllProfiles();
            }
        }
        else {
            hitsCounter = 0;
        }
        // alert('second hello');
    }, 1000);

}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "clicked_browser_action") {
            // var firstHref = $("a[href^='http']").eq(0).attr("href");
            // var firstHref = $("a[data-tab-key='friends']").eq(0).attr("href");
            alert("first!");
            var currentHref = window.location.href;
            var relativePathToPage = "settings/?tab=people_and_other_pages";
            var likesHref = currentHref.concat(relativePathToPage); //https://www.facebook.com/konscienceAI/settings/?tab=people_and_other_pages
            console.log(likesHref);
            chrome.runtime.sendMessage({ "message": "open_new_tab", "url": likesHref });
        }
        // else if (request.message === "opened_new_tab") {
        //     console.log("hello!hello!")
        //     alert("hello!")


        // }
    }
);

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "opened_new_tab") {
            console.log("hello!hello!")
            scrollTillEnd(false);
            // alert("second hello!")

        }
    }
);