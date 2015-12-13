///<reference path="../../../typings/bundle.d.ts" />

var $modal = $(`
               <div style="
                 display: none;
                 position: fixed;
                 top: 0;
                 left: 0;
                 width: 100%;
                 height: 100%;
                 z-index: 10000;
                 background-color: rgba(0,0,0,.5);
               ">
                 <div style="
                   width: 1000px;
                   height: 600px;
                   background-color: #fff;
                   margin-left: auto;
                   margin-right: auto;
                   margin-top: 80px;
                   border-radius: 2px;
                   box-shadow: 0px 5px 10px #000;
                 ">
                   <header class="modal-header" style="text-align: right;padding:20px;height: 56px">
                     <a href="#" class="modal-close-link">close</a>
                   </header>
                   <div class="modal-body"></div>
                 </div>
               </div>
               `);

var chartUrl=chrome.runtime.getURL('chart.html');
var chartFrame = $(`<iframe src=${chartUrl} class="chart-frame" style="border:none; width:100%;height:550px" />`)
var chartWindow = (<any>chartFrame[0]).contentWindow;

$modal.find('.modal-close-link').click(() => $modal.hide() && false);
$modal.find('.modal-body').append(chartFrame);

$('body').append($modal);

$('.Button.Button--action').click(() => {
    chrome.runtime.sendMessage('callMetadata');
    var rendered = () => {
        var $title = $('.QueryReport-title');
        if(!$title.length) {
            setTimeout(rendered, 200);
        }else{
            openChartModal($title);
        }
    };
    setTimeout(rendered, 400);
});

chrome.runtime.onMessage.addListener((msg) => {
    execQuery(msg.data);
});

var openChartModal = ($title: JQuery) => {
    var $openLink = $(`<a href="#" style="margin-left: 20px">Show Chart</a>`).click(($event) => {
        $modal.show();
        $event.preventDefault();
        $event.stopPropagation();
    });
    $title.append($openLink);
};

var execQuery = (callMetadata: any) => {
    $.ajax({
        url: callMetadata.url,
        method: 'get',
        headers: {
            'Authorization': callMetadata.auth
        }
    }).done(data => {
        (<any>($('iframe.chart-frame')[0])).contentWindow.postMessage(data, '*');
    });
};
