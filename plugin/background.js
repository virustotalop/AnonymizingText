/*var requestDB = indexedDB.open("anonymize");

requestDB.onupgradeneeded = function() {
	
	var db = requestDB.result;
	var store = db.createObjectStore("thesaurus");
	var key = store.createIndex("by_check", "check");
	var value = store.createIndex("by_replace", "replace");
	
};*/

console.log(thesaurus.get("absolve"));

var savedText = null;

browser.menus.create({
  id: "anonymize-text",
  title: "Anonymize Text",
  contexts: ["all"]
});

var sendMessage = function(message) {
	var querying = browser.tabs.query({
			active: true,
			currentWindow: true
	});
	querying.then(message);
};

function sendAnonymizeText(tabs) {
	browser.tabs.sendMessage(tabs[0].id, { id: "anonymizeText"});
}

function sendTransformedText(tabs) {
	browser.tabs.sendMessage(tabs[0].id, {id: "transformedText", target: target, savedText: savedText});
}

browser.menus.onClicked.addListener((info, tab) => {
	if(info.menuItemId == "anonymize-text")
	{
		sendMessage(sendAnonymizeText);
		console.log("test");
	}
});

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.id == "transformText") {
		var transformText = request.savedText;
		//savedText = "Some different text that is not the original";
		//Apply transformation
		
		var split = transformText.split(" ");
		console.log(split);
		for(var i = 0; i < split.length; i++)
		{
			if(split.length <= 1)
				continue;
			
			var capital = false;
			if(split[i][0] == split[i][0].toUpperCase())
				
			var synonym = thesaurus.get(split[i]);
			if(capital)
				synonym = thesaurus.get(split[i].toLowerCase());
			
			console.log(split[i] + " : " + synonym);
			if(synonym != undefined)
			{
				if(capital)
					split[i] = synonym.toUpperCase() + synonym.substring(1);
				else
					split[i] = synonym;
			}
			
		}
		
		var newText = "";
		for(var i = 0; i < split.length; i++)
		{
			newText += split[i] + " ";
		}
		
		
		//Save transformed text
		savedText = newText;
		//Send message
		sendMessage(sendTransformedText);
		console.log("sending transformed text");
	}
});