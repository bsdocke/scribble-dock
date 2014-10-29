RibbonView = Backbone.View.extend({
	el : $("#main_ribbon"),
	initialize : function() {
		this.layers = new Layers(null, {
			view : this
		});
	},
	events : {
		"click #new_btn" : "addLayer",
		"click .delBtn" : "deleteLayer"
	},
	onNewClickHandler : function(e) {
		var outerDoc = frameWin.parent.document;
		var body = outerDoc.getElementsByTagName("body")[0];
		var newDialog = outerDoc.createElement("div");
		newDialog.className = "closablePopup";

		var closeBtn = outerDoc.createElement("a");
		closeBtn.innerHTML = "X";
		closeBtn.className = "popupClose";
		closeBtn.id = "newDocClose";
		closeBtn.onclick = closePopup;

		var header = outerDoc.createElement("h1");
		header.innerHTML = "New Document";

		var widthInput = outerDoc.createElement("input");
		widthInput.id = "widthInput";
		widthInput.type = 'text';
		widthInput.label = "Canvas width: ";

		var heightInput = outerDoc.createElement("input");
		heightInput.id = "heightInput";
		heightInput.type = 'text';
		heightInput.label = "Canvas height: ";

		var fieldsSpan = outerDoc.createElement("span");
		fieldsSpan.className = "newCanvasFields";
		fieldsSpan.innerHTML = "Width:   ";

		var fieldsSpan2 = outerDoc.createElement("span");
		fieldsSpan2.className = "newCanvasFields";
		fieldsSpan2.innerHTML = "Height: ";

		var buttonsSpan = outerDoc.createElement("span");
		buttonsSpan.className = "newCanvasButtons";

		var ok = outerDoc.createElement("input");
		ok.type = "button";
		ok.value = "OK";
		ok.onclick = onOkClickHandler;

		var cancel = outerDoc.createElement("input");
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
});