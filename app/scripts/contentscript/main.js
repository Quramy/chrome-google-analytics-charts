///<reference path="../../../typings/bundle.d.ts" />
var $modal = $("\n               <div style=\"\n                 display: none;\n                 position: fixed;\n                 top: 0;\n                 left: 0;\n                 width: 100%;\n                 height: 100%;\n                 z-index: 10000;\n                 background-color: rgba(0,0,0,.5);\n               \">\n                 <div style=\"\n                   width: 1000px;\n                   height: 600px;\n                   background-color: #fff;\n                   margin-left: auto;\n                   margin-right: auto;\n                   margin-top: 80px;\n                   border-radius: 2px;\n                   box-shadow: 0px 5px 10px #000;\n                 \">\n                   <header class=\"modal-header\" style=\"text-align: right;padding:20px;height: 56px\">\n                     <a href=\"#\" class=\"modal-close-link\">close</a>\n                   </header>\n                   <div class=\"modal-body\"></div>\n                 </div>\n               </div>\n               ");
var chartUrl = chrome.runtime.getURL('chart.html');
var chartFrame = $("<iframe src=" + chartUrl + " class=\"chart-frame\" style=\"border:none; width:100%;height:550px\" />");
var chartWindow = chartFrame[0].contentWindow;
$modal.find('.modal-close-link').click(function () { return $modal.hide() && false; });
$modal.find('.modal-body').append(chartFrame);
$('body').append($modal);
$('.Button.Button--action').click(function () {
    chrome.runtime.sendMessage('callMetadata');
    var rendered = function () {
        var $title = $('.QueryReport-title');
        if (!$title.length) {
            setTimeout(rendered, 200);
        }
        else {
            openChartModal($title);
        }
    };
    setTimeout(rendered, 400);
});
chrome.runtime.onMessage.addListener(function (msg) {
    execQuery(msg.data);
});
var openChartModal = function ($title) {
    var $openLink = $("<a href=\"#\" style=\"margin-left: 20px\">Show Chart</a>").click(function ($event) {
        $modal.show();
        $event.preventDefault();
        $event.stopPropagation();
    });
    $title.append($openLink);
};
var execQuery = function (callMetadata) {
    $.ajax({
        url: callMetadata.url,
        method: 'get',
        headers: {
            'Authorization': callMetadata.auth
        }
    }).done(function (data) {
        ($('iframe.chart-frame')[0]).contentWindow.postMessage(data, '*');
    });
};
