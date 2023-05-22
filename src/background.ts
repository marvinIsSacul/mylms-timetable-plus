let active = false;

function makeOrange(color: string): void {
    document.body.style.backgroundColor = color;
}

chrome.action.onClicked.addListener((tab) => {
    active = !active;
    const color = active ? 'orange' : 'white';
    chrome.scripting.executeScript({
        target: {tabId: tab.id ? tab.id : -1},
        func: makeOrange,
        args: [color]
    }).then();
});

chrome.runtime.onInstalled.addListener(function() {
    chrome.tabs.onActivated.addListener(async info => {
        const tab = await chrome.tabs.get(info.tabId);

        const isMyLMS = tab.url?.startsWith('https://mylms.vossie.net/mytimetable/index.php');
        if (isMyLMS) {
            chrome.action.enable(tab.id)
        } else {
            chrome.action.disable(tab.id);
        }
    });
});
