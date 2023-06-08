// let active = false

// function makeOrange(color: string): void {
//     document.body.style.backgroundColor = color
// }

// // chrome.action.onClicked.addListener((tab) => {
// //     active = !active
// //     const color = active ? 'orange' : 'white'
// //     chrome.scripting.executeScript({
// //         target: {tabId: tab.id ? tab.id : -1},
// //         func: makeOrange,
// //         args: [color]
// //     })
// // })

// chrome.runtime.onInstalled.addListener(function() {
//     chrome.tabs.onActivated.addListener(async info => {
//         const tab = await chrome.tabs.get(info.tabId)

//         const isMyLMS = tab.url?.startsWith('https://mylms.vossie.net/mytimetable/index.php')
//         if (isMyLMS) {
//             await chrome.action.enable(tab.id)
//         } else {
//             await chrome.action.disable(tab.id)
//         }
//     })

//     chrome.tabs.onUpdated.addListener(async tabId => {
//         const tab = await chrome.tabs.get(tabId)
//         const isMyLMS = tab.url?.startsWith('https://mylms.vossie.net/mytimetable/index.php')
//         if (isMyLMS) {
//             await chrome.action.enable(tab.id)
//         } else {
//             await chrome.action.disable(tab.id)
//         }
//     })
// })
