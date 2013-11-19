var onSaveClickHandler = function(e) {
	var workPanelList = frameWin.parent.document.getElementById("workPanel");
	var result = frameWin.document.createElement("canvas");
	result.setAttribute("width", frameWin.parent.canvasWidth);
	result.setAttribute("height", frameWin.parent.canvasHeight);
	result.id = "image_canvas";
	var resultCtx = result.getContext('2d');
	var resultData = resultCtx.getImageData(0, 0, frameWin.parent.canvasWidth, frameWin.parent.canvasHeight);
	var resultPix = resultData.data;
	for (var m = 0; m < workPanelList.childNodes.length; m++) {
		if (!workPanelList.childNodes[m].getContext) {
			continue;
		}
		if (workPanelList.childNodes[m].className != "overlay_canvas") {
			var layerCtx = workPanelList.childNodes[m].getContext('2d');
			var layerData = layerCtx.getImageData(0, 0, frameWin.parent.canvasWidth, frameWin.parent.canvasHeight);
			var layerPix = layerData.data;

			for (var i = 0; i < frameWin.parent.canvasWidth * frameWin.parent.canvasHeight * 4; i += 4) {
				if (layerPix[i] != 0 || layerPix[i + 1] != 0 || layerPix[i + 2] != 0 || layerPix[i + 3] != 0) {
					resultPix[i] = layerPix[i];
					resultPix[i + 1] = layerPix[i + 1];
					resultPix[i + 2] = layerPix[i + 2];
					resultPix[i + 3] = layerPix[i + 3];
				}
			}
		}
	}
	resultCtx.putImageData(resultData, 0, 0);
	if (navigator.appName != 'Microsoft Internet Explorer') {
		window.open(result.toDataURL('png'));
	} else {
		newWindow("<img src=\"" + result.toDataURL('png') + "\"/>");
		function newWindow(content) {
			top.consoleRef = window.open("", "Exported Image. You may save this to your computer", "width=" + frameWin.parent.canvasWidth + ",height=" + frameWin.parent.canvasHeight + ",menubar=0" + ",toolbar=1" + ",status=0" + ",scrollbars=1" + ",resizable=1")
			top.consoleRef.document.writeln("<html><head><title>Exported Image</title></head>" + "<body bgcolor=white onLoad=\"self.focus()\">" + content + "</body></html>")
			top.consoleRef.document.close()
		};
	}
	return result.toDataURL('image/png');
};

var onExportToImgurClickHandler = function(e) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "https://api.imgur.com/3/image");
	xhr.setRequestHeader('Authorization', 'Client-ID 75ecacee4c13695');
	xhr.setRequestHeader('Accept', 'json');

	var imageData = onSaveClickHandler({});
	imageData = imageData.replace(/^data:image\/(png|jpg);base64,/, "");

	var fd = new FormData();
	fd.append("image", imageData);
	xhr.send(fd);

	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			console.log(xhr.responseText);
		}
	};

};

var onNewClickHandler = function(e) {
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

};

var onTabClick = function(e) {
	var oldClasses = e.target.className;
	var tokens = oldClasses.split(" ");
	e.target.className = "";
	for (var i = 0; i < tokens.length - 1; i++) {
		e.target.className += tokens[i] + " ";
	}
	e.target.className += ".tab_active";
}
var onToolbarInit = function(e) {
	frameWin = e;
	var saveBtn = e.document.getElementById("save_btn");
	saveBtn.onclick = onSaveClickHandler;

	var newBtn = e.document.getElementById("new_btn");
	newBtn.onclick = onNewClickHandler;

	var exportBtn = e.document.getElementById("export_btn");
	exportBtn.onclick = onExportToImgurClickHandler;

	var tabs = document.getElementsByClassName("tab");
	for (var t in tabs) {
		tabs[t].onclick = onTabClick;
	}
};

var onOkOverwriteClickHandler = function(e) {
	var delBtns = document.getElementsByClassName("delBtn");
	for (var i = 0; i < delBtns.length; i++) {
		var e = {};
		e.target = delBtns[i];
		onDeleteClickHandler(e);
	}

	closePopup({
		target : getId("overwriteClose")
	});
	getId("workPanel").removeChild(document.getElementsByTagName("canvas")[0]);
	layerNum = 0;
	onOkClickHandler({});
};

var onOkClickHandler = function(e) {
	window.canvasWidth = getId("widthInput").value;
	window.canvasHeight = getId("heightInput").value;
	if (document.getElementsByTagName("canvas").length > 0) {

		var body = document.getElementsByTagName("body")[0];
		var newDialog = document.createElement("div");
		newDialog.className = "closablePopup";

		var header = document.createElement("h1");
		header.innerHTML = "Erase existing document?";

		var buttonsSpan = document.createElement("span");
		buttonsSpan.className = "newCanvasButtons";

		var ok = document.createElement("input");
		ok.type = "button";
		ok.value = "OK";
		ok.onclick = onOkOverwriteClickHandler;

		var cancel = document.createElement("input");
		cancel.type = "button";
		cancel.value = "Cancel";
		cancel.onclick = closePopup;

		var closeBtn = document.createElement("a");
		closeBtn.innerHTML = "X";
		closeBtn.className = "popupClose";
		closeBtn.id = "overwriteClose";
		closeBtn.onclick = closePopup;

		newDialog.appendChild(closeBtn);
		newDialog.appendChild(header);

		buttonsSpan.appendChild(ok);
		buttonsSpan.appendChild(cancel);
		newDialog.appendChild(buttonsSpan);
		body.appendChild(newDialog);
	} else {
		initNewDocument();
	}
};

var initNewDocument = function() {
	initCanvases();
	initControlPanel();
	closePopup({
		target : getId("newDocClose")
	});
};

