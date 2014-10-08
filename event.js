chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.sendMessage(tab.id, { method: 'getSelection' }, function (response) {
        // TODO: handle and send DOM node in addition to selected text
        handleTextSelection(response.data);
    });
});

function extractSentences (text) {
    // TODO: account for common abbreviations/honoraries, such as...
    //       Dr., Mr., Mrs., Ms., St., Ave., Blvd., etc.
    return text.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split(/[\r\n]|\|/);
}

function handleTextSelection (selectedText) {
    var sentences = extractSentences(selectedText);

    console.log('Selected Text: ', selectedText);
    console.log('Sentences: ', sentences);

    // TODO: send DOM node in addition to sentences

    narrate(sentences);
}

function narrate (sentences) {
    var narrateNextSentence = function () {
        if (sentences.length > 0) {
            var sentence = sentences.splice(0, 1)[0];

            console.log('Current sentence: ', sentence);
            console.log('Remaining sentences: ', sentences);

            // TODO: If current sentence is too long, split it up and pre-end the second half to sentences
            // TODO: determine maximum "utterance" length before tts cuts out

            // TODO: highlight each sentence in DOM node
            chrome.tts.speak(sentence, {
                onEvent: function (event) {
                    console.log('Event ' + event.type + ' at position ' + event.charIndex);

                    // TODO: underline each word in DOM node as it's spoken

                    if (event.type === 'end') {
                        console.log('End event caught. Narrating next sentence.');
                        narrateNextSentence();
                    }

                    if (event.type === 'error') {
                        console.log('Error: ' + event.errorMessage);
                    }
                }
            });
        } else {
            console.log('No more sentences to narrate.');
        }
    };

    narrateNextSentence();
}
