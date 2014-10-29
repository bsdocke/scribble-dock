function InputPopupView(doc){
	var _doc = doc;
	this.prototype = function(){
		var _doc = doc;
		var _title;
		var _inputs;
		var _buttons;
	return {};
	
	var body = outerDoc.body;
	var newDialog = _doc.createElement("div");
	newDialog.className = "closablePopup";

	var closeBtn = _doc.createElement("a");
	closeBtn.innerHTML = "X";
	closeBtn.className = "popupClose";
	closeBtn.id = "newDocClose";
	closeBtn.onclick = closePopup;

	var header = _doc.createElement("h1");
	header.innerHTML = "New Document";

	var widthInput = _doc.createElement("input");
	widthInput.id = "widthInput";
	widthInput.type = 'text';
	widthInput.label = "Canvas width: ";

	var heightInput = _doc.createElement("input");
	heightInput.id = "heightInput";
	heightInput.type = 'text';
	heightInput.label = "Canvas height: ";

	var fieldsSpan = _doc.createElement("span");
	fieldsSpan.className = "newCanvasFields";
	fieldsSpan.innerHTML = "Width:   ";

	var fieldsSpan2 = _doc.createElement("span");
	fieldsSpan2.className = "newCanvasFields";
	fieldsSpan2.innerHTML = "Height: ";

	var buttonsSpan = _doc.createElement("span");
	buttonsSpan.className = "newCanvasButtons";

	var ok = _doc.createElement("input");
	ok.type = "button";
	ok.value = "OK";
	ok.onclick = onOkClickHandler;

	var cancel = _doc.createElement("input");
	cancel.type = "button";
	cancel.value = "Cancel";
	cancel.onclick = closePopup;

	newDialog.appendChild(closeBtn);
	newDialog.appendChild(header);
	fieldsSpan.appendChild(widthInput);
	fieldsSpan2.appendChild(heightInput);
	buttonsSpan.appendChild(ok);
	buttonsSpan.appendChild(cancel);
	newDialog.appendChild(fieldsSpan);
	newDialog.appendChild(fieldsSpan2);
	newDialog.appendChild(buttonsSpan);

	body.appendChild(newDialog);
	}
};