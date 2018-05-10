/*var requestDB = indexedDB.open("anonymize");

requestDB.onupgradeneeded = function() {
	
	var db = requestDB.result;
	var store = db.createObjectStore("thesaurus");
	var key = store.createIndex("by_check", "check");
	var value = store.createIndex("by_replace", "replace");
	
};*/

console.log(thesaurus.get("absolve"));

browser.menus.create({
  id: "anonymize-text",
  title: "Anonymize Text",
  contexts: ["all"]
});

function messageTab(tabs) {
  browser.tabs.sendMessage(tabs[0].id, "anonymize-text");
}

function onExecuted(result) {
    var querying = browser.tabs.query({
        active: true,
        currentWindow: true
    });
    querying.then(messageTab);
}

browser.menus.onClicked.addListener((info, tab) => {
	if(info.menuItemId == "anonymize-text")
	{
		let executing = browser.tabs.executeScript({
			file: "anonymize-text.js"
		});
		executing.then(onExecuted);
		console.log("test");
	}
});
