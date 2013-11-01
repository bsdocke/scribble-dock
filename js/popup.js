var dragPopupUp = function(e) {
	e.target.removeEventListener('mousemove', dragPopup);
};

var dragPopupDown = function(e) {
	var posx = 0;
	var posy = 0;
	if (e.pageX || e.pageY) {
		clickOriginalX = e.pageX;
		clickOriginalY = e.pageY;
	} else if (e.clientX || e.clientY) {
		clickOriginalX = e.clientX + document.body.scrollLeft;
		clickOriginalY = e.clientY + document.body.scrollTop;
	}
	popupOriginalX = e.target.offsetLeft;
	popupOriginalY = e.target.offsetTop;
	e.target.addEventListener('mousemove', dragPopup);
	e.target.addEventListener('mouseup', dragPopupUp);
};

var dragPopup = function(e) {

	var posx = 0;
	var posy = 0;
	if (e.pageX || e.pageY) {
		posx = e.pageX;
		posy = e.pageY;
	} else if (e.clientX || e.clientY) {
		posx = e.clientX + document.body.scrollLeft;
		posy = e.clientY + document.body.scrollTop;
	}
	var deltaX = posx - clickOriginalX;
	var deltaY = posy - clickOriginalY;
	e.target.style.left = popupOriginalX + deltaX + "px";
	e.target.style.top = popupOriginalY + deltaY + "px";

};

var closePopup = function(e) {
	var parentLevel = e.target.parentElement;
	while (parentLevel.className != "closablePopup") {
		parentLevel = parentLevel.parentElement;
	}
	parentLevel.style.display = 'none';
}; 