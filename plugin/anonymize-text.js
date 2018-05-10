//https://stackoverflow.com/questions/7703697/how-to-retrieve-the-element-where-a-contextmenu-has-been-executed
//Modified from the code above



document.addEventListener("mousedown", function(event)
{
	if(event.button == 2) 
	{ 
        	var clicked = event.target;
			alert("right clicked");
		browser.runtime.sendMessage({
			id: "currentTarget",
			currentTarget: clicked
		});
		
	}
}, true);


browser.runtime.onMessage.addListener(function(request, sender, sendResponse) 
{
	if(request.id != null && request.id == "anonymizeText") 
	{
		alert("Received anonymizeText");
        	browser.runtime.sendMessage({
			id: "sendTarget"
		});
	}
});

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) 
{
	if(request.id != null && request.id == "receiveTarget")
	{
		alert("received target");
		
	}
});


