//https://stackoverflow.com/questions/7703697/how-to-retrieve-the-element-where-a-contextmenu-has-been-executed
//Modified from the code above



document.addEventListener("mousedown", function(event){
	if(event.button == 2) 
	{ 
        var clicked = event.target;
		browser.runtime.sendMessage({
			id: "current-target",
			current-target: clicked
		});
    }
}, true);


browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request == "anonymize-text") {
        alert(clicked);
    }
});