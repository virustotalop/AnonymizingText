console.log(thesaurus.get("absolve"));

var savedText = null;

browser.menus.create({
  id: "anonymize-text",
  title: "Anonymize Text",
  contexts: ["all"]
});

var sendMessage = function(message) 
{
	var querying = browser.tabs.query({
			active: true,
			currentWindow: true
	});
	querying.then(message);
};

function sendAnonymizeText(tabs) 
{
	browser.tabs.sendMessage(tabs[0].id, { id: "anonymizeText"});
}

function sendTransformedText(tabs) 
{
	browser.tabs.sendMessage(tabs[0].id, {id: "transformedText", target: target, savedText: savedText});
}

browser.menus.onClicked.addListener((info, tab) => 
{
	if(info.menuItemId == "anonymize-text")
	{
		sendMessage(sendAnonymizeText);
	}
});

//Work around for both issues with parsing currently
function normalizeText(transformText) 
{
	var comma = normalizeCommas(transformText);
	var space = normalizeSpaces(comma);
	while(space.includes("  "))
	{
		space = normalizeSpaces(space);
	}
	var ending = normalizeEndingPunctuation(space);
	return ending;
}

function isEndingPunctuation(ch)
{
	return (ch == '.' || ch == '!' || ch == '?');
}

//Temporary workaround to cleanup punctuation not having a space after them
function normalizeEndingPunctuation(transformText) 
{
	var newText = "";
	for(var i = 0; i < transformText.length; i++)
	{

		if(isEndingPunctuation(transformText[i]) && i + 1 < transformText.length && transformText[i + 1] != ' ')
		{
			
			newText += transformText[i] + " ";
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
function normalizeCommas(transformText) 
{
	return transformText.replace(" , " , ", ");
}

//Temporary workaround for double space glitch
function normalizeSpaces(transformText) 
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
	var cleanedText = normalizeText(outText);
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