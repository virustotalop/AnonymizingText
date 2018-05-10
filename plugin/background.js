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

browser.menus.onClicked.addListener((info, tab) => {
	if(info.menuItemId == "anonymize-text")
	{
		console.log("test");
	}
});

