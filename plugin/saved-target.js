var target = null;

//Receive target message
var sendReceiveTarget = function(tabs) 
{
	browser.tabs.sendMessage(tabs[0].id, { id: "receiveTarget" , target: target});
}

//Received current target
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) 
{
	if(request.id == "currentTarget") 
	{
		target = request.target;
	}
});

//When message is received send the target
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) 
{
	if(request.id == "sendTarget") 
	{
		sendMessage(sendReceiveTarget);
	}
});