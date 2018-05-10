var target = null;
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.id != null && request.id == "current-target") {
		target = request.target;
	}
});
