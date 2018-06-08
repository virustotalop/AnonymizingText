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

//Work around for both issues with parsing currently
function cleanupText(transformText) 
{
	var comma = cleanupCommas(transformText);
	var space = cleanupSpaces(comma);
	while(space.includes("  "))
	{
		space = cleanupSpaces(space);
	}
	var period = cleanupPeriod(space);
	return period;
}

//Workaround to cleanup periods not having a space after them
function cleanupPeriod(transformText) 
{
	var newText = "";
	for(var i = 0; i < transformText.length; i++)
	{

		if(transformText[i] == '.' && i + 1 < transformText.length && transformText[i + 1] != ' ')
		{
			console.log("is period: " + (transformText[i] == '.'));
			console.log("before: " + (transformText[i - 1]));
			newText += ". ";
		}
		else
		{
			newText += transformText[i];
		}
	}
	if(newText == "")
	{
		return transformText;
	}
	return newText;
}

//Temporary workaround for comma glitch (having a space infront of a comma)
function cleanupCommas(transformText) 
{
	return transformText.replace(" , " , ", ");
}

//Temporary workaround for double space glitch
function cleanupSpaces(transformText) 
{
	return transformText.replace("  ", " ");
}

function anonymizeText(transformText) 
{
	
	var doc = nlp(transformText);
	var out = nlp(transformText).out('array');
		
	var split = [];
		
	console.log(out);
		
	var index = 0;
	for(var i = 0; i < out.length; i++)
	{
		var outSplit = out[i].split(" ");
		console.log(outSplit);
		for(var j = 0; j < outSplit.length; j++)
		{
			//console.log(outSplit[j]);
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
			capital = true;
		//console.log("Check for: " + checkFor);
		var synonym = thesaurus.get(checkFor);
		if(capital)
			synonym = thesaurus.get(checkFor.toLowerCase());
			
		//console.log(checkFor + " : " + synonym);
		if(synonym != undefined)
		{
			var replace = undefined;
			if(capital)
			{	
				replace = synonym[0].toUpperCase() + synonym.substring(1);
			}
			else
			{
				replace = synonym;
			}
			//console.log("Is capital: " + capital);
			doc.replace(split[i], replace);
		}
	}
	console.log(doc.sentences());
	var outText = doc.out('text');
	console.log("outText: " + outText);
	var cleanedText = cleanupText(outText);
	return cleanedText;
}

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) 
{
	if(request.id == "transformText") 
	{
		var transformedText = anonymizeText(request.savedText); 
		//Save transformed text
		savedText = transformedText;
		sendMessage(sendTransformedText);
		console.log("sending transformed text");
	}
});