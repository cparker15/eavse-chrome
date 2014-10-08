chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.method === 'getSelection') {
        // TODO: send DOM node in addition to selected text
        sendResponse({
            data: window.getSelection().toString()
        });
    } else {
        sendResponse({}); // snub them.
    }
});
