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
		
		var doc = nlp(request.savedText);
		var out = nlp(request.savedText).normalize().out('array');
		
		var split = [];
		
		console.log(out);
		
		var index = 0;
		for(var i = 0; i < out.length; i++)
		{
			var outSplit = out[i].split(" ");
			console.log(outSplit);
			for(var j = 0; j < outSplit.length; j++)
			{
				console.log(outSplit[j]);
				split[index] = outSplit[j];
				index += 1;
			}
		}
		
		console.log(split);
		
		for(var i = 0; i < split.length; i++)
		{	
			var checkFor = split[i];
			var capital = false;
			if(checkFor[0] == checkFor[0].toUpperCase())
				
			var synonym = thesaurus.get(checkFor);
			if(capital)
				synonym = thesaurus.get(checkFor.toLowerCase());
			
			console.log(checkFor + " : " + synonym);
			if(synonym != undefined)
			{
				var replace = undefined;
				if(capital)
				{	
					replace = synonym.toUpperCase() + synonym.substring(1);
				}
				else
				{
					replace = synonym;
				}
				doc.replace(split[i], replace);
			}
		}
		
		
		
		//Save transformed text
		savedText = doc.out();
		//Send message
		sendMessage(sendTransformedText);
		console.log("sending transformed text");
	}
});