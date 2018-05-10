var target = null;
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.id != null && request.id == "currentTarget") {
		console.log("received current target");
		target = request.target;
	}
});

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.id != null && request.id == "sendTarget") {
		browser.runtime.sendMessage({
			id: "receiveTarget",
			target: target
		});
	}
});
