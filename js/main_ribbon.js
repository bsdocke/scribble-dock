var onSaveClickHandler = function(e) {
	var workPanelList = window.parent.document.getElementById("workPanel");
	var result = document.createElement("canvas");
	result.setAttribute("width", 800);
	result.setAttribute("height", 600);
	result.id = "image_canvas";
	var resultCtx = result.getContext('2d');
	var resultData = resultCtx.getImageData(0, 0, 800, 600);
	var resultPix = resultData.data;
	for (var m = 0; m < workPanelList.childNodes.length; m++) {
		if (!workPanelList.childNodes[m].getContext) {
			continue;
		}
		if (workPanelList.childNodes[m].className != "overlay_canvas") {
			var layerCtx = workPanelList.childNodes[m].getContext('2d');
			var layerData = layerCtx.getImageData(0, 0, 800, 600);
			var layerPix = layerData.data;

			for (var i = 0; i < 800 * 600 * 4; i += 4) {
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
			top.consoleRef = window.open("", "Exported Image. You may save this to your computer", "width=" + 800 + ",height=" + 600 + ",menubar=0" + ",toolbar=1" + ",status=0" + ",scrollbars=1" + ",resizable=1")
			top.consoleRef.document.writeln("<html><head><title>Exported Image</title></head>" + "<body bgcolor=white onLoad=\"self.focus()\">" + content + "</body></html>")
			top.consoleRef.document.close()
		};
	}
};

var onToolbarInit = function(e) {
	var saveBtn = document.getElementById("save_btn");
	saveBtn.onclick = onSaveClickHandler;
};

window.onload = onToolbarInit;
