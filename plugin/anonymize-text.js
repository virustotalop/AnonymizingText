//Saves element id to background script when right clicked
//https://stackoverflow.com/questions/7703697/how-to-retrieve-the-element-where-a-contextmenu-has-been-executed
document.addEventListener("mousedown", function(event)
{
	if(event.button == 2) 
	{ 
        var clicked = event.target;
		browser.runtime.sendMessage({
			id: "currentTarget",
			target: clicked.id
		});	
	}
}, true);

//Request target to be sent to backend
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) 
{
	if(request.id == "anonymizeText") 
	{
        	browser.runtime.sendMessage({
				id: "sendTarget"
			});
	}
});

//Sends the text to the backend to be transformed
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) 
{
	if(request.id == "receiveTarget")
	{
		var targetId = request.target;
		var requestedTarget = document.getElementById(targetId);
		var requestedText = requestedTarget.value;
		browser.runtime.sendMessage({
			id: "transformText",
			savedText: requestedText
		});
	}
});

//Page update happens here
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) 
{
	if(request.id == "transformedText")
	{
		var targetId = request.target;
		var requestedTarget = document.getElementById(targetId);
		var transformedText = request.savedText;
		requestedTarget.value = transformedText;
	}
});