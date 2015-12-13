///<reference path="../../../typings/bundle.d.ts" />
(function() {
    var lastCallMetadata = {
        url: null, auth: null
    };

    var tabId;

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        sendResponse({type: 'callMetadata', data:lastCallMetadata});
        tabId = sender.tab.id;
    });

    chrome.webRequest.onSendHeaders.addListener(details => {
        var url = details.url;
        var auth = details.requestHeaders.filter(h => h.name === 'Authorization')[0].value;
        lastCallMetadata.url = url;
        lastCallMetadata.auth = auth;
        if(tabId) {
            chrome.tabs.sendMessage(tabId, {type: 'callMetadata', data: lastCallMetadata});
            tabId = null;
        }
    }, {
        urls: ['https://content.googleapis.com/analytics/v3/data/ga*']
    }, ["requestHeaders"]);

})();
