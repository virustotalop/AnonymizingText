var target = null;
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) 
{
	if(request.id == "currentTarget") 
	{
		console.log("received current target");
		target = request.target;
	}
});

var sendReceiveTarget = function(tabs) 
{
	browser.tabs.sendMessage(tabs[0].id, { id: "receiveTarget" , target: target});
}

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) 
{
	if(request.id == "sendTarget") 
	{
		console.log("after tabs query");
		sendMessage(sendReceiveTarget);
		console.log("sent receive target");
	}
});