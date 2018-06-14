var savedText = null;

//Create menu
browser.menus.create({
  id: "anonymize-text",
  title: "Anonymize Text",
  contexts: ["all"]
});

//Send message function
var sendMessage = function(message) 
{
	var querying = browser.tabs.query({
			active: true,
			currentWindow: true
	});
	querying.then(message);
};

//Mesage for sending request for text
function sendAnonymizeText(tabs) 
{
	browser.tabs.sendMessage(tabs[0].id, { id: "anonymizeText"});
}

//Message for sending transformed text
function sendTransformedText(tabs) 
{
	browser.tabs.sendMessage(tabs[0].id, {id: "transformedText", target: target, savedText: savedText});
}

//When context menu clicked send message
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
	transformText = normalizeCommas(transformText);
	transformText = normalizeSpaces(transformText);
	
	while(transformText.includes("  "))
	{
		transformText = normalizeSpaces(transformText);
	}
	
	transformText = normalizeEndingPunctuation(transformText);
	transformText = normalizeCapitalization(transformText);
	return transformText;
}

//Is ending punctuation
function isEndingPunctuation(ch)
{
	return (ch == '.' || ch == '!' || ch == '?');
}

//Cleans up capitalization
function normalizeCapitalization(transformText)
{
	for(var i = 0; i < transformText.length; i++)
	{
		if(isEndingPunctuation(transformText[i]) && i + 3 < transformText.length)
		{
			transformText = (transformText.substring(0, i + 2) + transformText[i + 2].toUpperCase() + transformText.substring(i + 3));
		}
	}
	return transformText;
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

//Does the anonymization process
function anonymizeText(transformText) 
{
	
	var doc = nlp(transformText);
	var out = nlp(transformText).out('array');
		
	var split = [];
		
	var index = 0;
	for(var i = 0; i < out.length; i++)
	{
		var outSplit = out[i].split(" ");
		for(var j = 0; j < outSplit.length; j++)
		{
			split[index] = outSplit[j];
			index += 1;
		}
	}
		
	for(var i = 0; i < split.length; i++)
	{	
		var checkFor = split[i];
		var capital = false;
		if(checkFor[0] == checkFor[0].toUpperCase())
			capital = true;
		
		var synonym = thesaurus.get(checkFor);
		if(capital)
			synonym = thesaurus.get(checkFor.toLowerCase());
			
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
			doc.replace(split[i], replace);
		}
	}
	var outText = doc.out('text');
	var cleanedText = normalizeText(outText);
	return cleanedText;
}

//Listener for when text is transformed, sends update to front end
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) 
{
	if(request.id == "transformText") 
	{
		var transformedText = anonymizeText(request.savedText); 
		//Save transformed text
		savedText = transformedText;
		sendMessage(sendTransformedText);
	}
});