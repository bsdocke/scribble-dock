var getId = function(idString){
	return document.getElementById(idString);
};

var getClass = function(className){
	return document.getElementsByClassName(className);
};

var getNumberOfChildElements = function(parentElement){
	var count = 0;
	for(var i in parentElement.childNodes){
		if(parentElement.childNodes[i].nodeType == Node.ELEMENT_NODE){
			count++;
		}
	}
	return count;
};
