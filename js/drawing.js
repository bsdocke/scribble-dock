var layerNum = 0;
var lineStarted = false;
var activeLayer;
var animationInterval = {};

var SELECTOR_TOOL = "Selector";
var RECTANGLE_TOOL = "Rectangle";
var ELLIPSE_TOOL = "Ellipse";
var LINE_TOOL = "Line";
var BRUSH_TOOL = "Brush";
var FILL_TOOL = "Fill";
var ERASER_TOOL = "Eraser";
var TEXT_TOOL = "Text";

var currentTool = {
	name : "",
	hasBoundingBox : false,
}

var isRectangleTool = function() {
	return currentTool.name == RECTANGLE_TOOL;
};

var isLineTool = function() {
	return currentTool.name == LINE_TOOL;
}
var isBrushTool = function() {
	return currentTool.name == BRUSH_TOOL;
};

var isEllipseTool = function() {
	return currentTool.name == ELLIPSE_TOOL;
};

var isFillTool = function() {
	return currentTool.name == FILL_TOOL;
};

var isEraserTool = function() {
	return currentTool.name == ERASER_TOOL;
};

var isSelectionTool = function() {
	return currentTool.name == SELECTOR_TOOL;
};

var isTextTool = function() {
	return currentTool.name == TEXT_TOOL;
};

var onMouseMoveHandler = function(e) {
	var x, y;
	var point = findOffset(e.target);
	x = e.pageX - point.x;
	y = e.pageY - point.y;
	if (!currentCanvas.locked) {

		if (isRectangleTool()) {
			overlayCtx.beginPath();
			overlayCtx.closePath();
			var w = overlayCanvas.width;
			var h = overlayCanvas.height;
			overlayCanvas.width = 1;
			overlayCanvas.width = w;
			overlayCtx.clearRect(0, 0, w, h);
			drawRectangleOnContext(overlayCtx, e);
		} else if (isSelectionTool()) {
			overlayCtx.beginPath();
			overlayCtx.closePath();
			overlayCtx.oldStroke = overlayCtx.strokeStyle;
			var w = overlayCanvas.width;
			var h = overlayCanvas.height;
			overlayCanvas.width = 1;
			overlayCanvas.width = w;
			overlayCtx.clearRect(0, 0, w, h);
			overlayCtx.setLineDash([4, 1]);
			drawRectangleOnContext(overlayCtx, e);
			overlayCtx.strokeStyle = overlayCtx.oldStroke;
		} else if (isEllipseTool()) {
			overlayCtx.beginPath();
			overlayCtx.closePath();
			var w = overlayCanvas.width;
			var h = overlayCanvas.height;
			overlayCtx.clearRect(0, 0, w, h);
			drawEllipseOnContext(overlayCtx, e);
		} else if (isLineTool()) {
			overlayCtx.beginPath();
			overlayCtx.closePath();
			var w = overlayCanvas.width;
			var h = overlayCanvas.height;
			overlayCanvas.width = 1;
			overlayCanvas.width = w;
			overlayCtx.clearRect(0, 0, w, h);

			overlayCtx.strokeStyle = ctx.strokeStyle;
			overlayCtx.lineWidth = ctx.lineWidth;
			overlayCtx.beginPath();
			overlayCtx.moveTo(boundingBoxX, boundingBoxY);
			overlayCtx.lineTo(x, y);
			overlayCtx.stroke();

		} else if (isBrushTool()) {
			if (lineStarted) {
				ctx.lineTo(x, y);
				ctx.stroke();
			} else {
				ctx.beginPath();
				ctx.moveTo(x, y);
				lineStarted = true;
			}
		} else if (isEraserTool()) {
			ctx.globalCompositeOperation = "destination-out";
			if (lineStarted) {
				ctx.lineTo(x, y);
				ctx.stroke();
			} else {
				ctx.beginPath();
				ctx.moveTo(x, y);
				lineStarted = true;
			}
		}
	}
};

var findOffset = function(element) {
	var left = 0;
	var top = 0;
	if (element.offsetParent) {
		do {
			top += element.offsetTop;
			left += element.offsetLeft;
		} while(element = element.offsetParent);
		return {
			x : left,
			y : top
		};
	}
};

var onMouseDownHandler = function(e) {
	window.clearInterval(animationInterval);
	var panel = getId("workPanel");
	panel.addEventListener("mousemove", onMouseMoveHandler, true);
	if (!currentCanvas.locked && (isRectangleTool() || isEllipseTool() || isSelectionTool() || isLineTool())) {
		var point = findOffset(e.target);
		boundingBoxX = e.pageX - point.x;
		boundingBoxY = e.pageY - point.y;
	} else if (!currentCanvas.locked && isLineTool()) {
		overlayCtx.strokeStyle = ctx.strokeStyle;
		overlayCtx.lineWidth = ctx.lineWidth;
	}
};

var removeMoveListenerFromWorkPanel = function() {
	var panel = getId("workPanel");
	panel.removeEventListener("mousemove", onMouseMoveHandler, true);
};

var onMouseUpHandler = function(e) {
	removeMoveListenerFromWorkPanel();
	lineStarted = false;
	if (!currentCanvas.locked) {
		if (isRectangleTool()) {
			commitRectangleToCanvas(e);
		} else if (isSelectionTool()) {
			var x, y;
			var point = findOffset(event.target);
			x = e.pageX - point.x;
			y = e.pageY - point.y;

			if (x < boundingBoxX) {
				overlayCtx.selectedLeft = x;
				overlayCtx.selectedRight = boundingBoxX;
				if (y < boundingBoxY) {
					overlayCtx.selectedTop = y;
					overlayCtx.selectedBottom = boundingBoxY;
				} else {
					overlayCtx.selectedTop = boundingBoxY;
					overlayCtx.selectedBottom = y;
				}
			} else {
				overlayCtx.selectedLeft = boundingBoxX;
				overlayCtx.selectedRight = x;
				if (y < boundingBoxY) {
					overlayCtx.selectedTop = y;
					overlayCtx.selectedBottom = boundingBoxY;
				} else {
					overlayCtx.selectedTop = boundingBoxY;
					overlayCtx.selectedBottom = y;
				}
			}
			overlayCtx.fillStyle = '';
			drawRectangleOnContext(overlayCtx, e);
			animationInterval = window.setInterval(function() {
				
				overlayCtx.beginPath();
				overlayCtx.closePath();
				var w = overlayCanvas.width;
				var h = overlayCanvas.height;
				overlayCanvas.width = 1;
				overlayCanvas.width = w;
				overlayCtx.clearRect(0, 0, w, h);
				overlayCtx.setLineDash([4,1]);
				drawRectangleOnContext(overlayCtx, e);
				if (overlayCtx.lineDashOffset == 2) {
					overlayCtx.lineDashOffset = 0;
				} else {
					overlayCtx.lineDashOffset = 2;
				}
			}, 750);
			window.onkeyup = function(e) {
				if (e.keyCode == 46) {
					ctx.clearRect(overlayCtx.selectedLeft, overlayCtx.selectedTop, Math.abs(overlayCtx.selectedLeft - overlayCtx.selectedRight), Math.abs(overlayCtx.selectedTop - overlayCtx.selectedBottom));
					currentCanvas.onkeydown = null;
					overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
					overlayCtx.selectedTop = null;
					overlayCtx.selectedBottom = null;
					overlayCtx.selectedLeft = null;
					overlayCtx.selectedRight = null;
					window.clearInterval(animationInterval);
				}
			};
			
			overlayCtx.strokeStyle = overlayCtx.oldStroke;
			overlayCtx.setLineDash([1,0]);
			overlayCtx.lineDashOffset=0;
		} else if (isTextTool()) {
			var x, y;
			var point = findOffset(event.target);
			x = e.pageX - point.x;
			y = e.pageY - point.y;

			var text = prompt("Please input your desired text");
			if (text != null) {
				ctx.textAlign = "left";
				ctx.textBaseline = "top";
				ctx.fillText(text, x, y);
			}
		} else if (isEllipseTool()) {
			commitEllipseToCanvas(e);
		} else if (isFillTool()) {
			commitFillToCanvas(e);
		} else if (isEraserTool()) {
			ctx.globalCompositeOperation = "destination-over";
		} else if (isLineTool()) {
			var x, y;
			var point = findOffset(event.target);
			x = e.pageX - point.x;
			y = e.pageY - point.y;

			ctx.closePath();
			ctx.beginPath();
			ctx.moveTo(boundingBoxX, boundingBoxY);
			ctx.lineTo(x, y);
			ctx.stroke();

			overlayCtx.strokeStyle = "#000000";
			overlayCtx.lineWidth = 1;
			var w = overlayCanvas.width;
			var h = overlayCanvas.height;
			overlayCanvas.width = 1;
			overlayCanvas.width = w;
			overlayCtx.clearRect(0, 0, w, h);
		}
	}
};

var addEventsToCanvas = function() {
	var panel = getId("workPanel");
	panel.addEventListener("mousedown", onMouseDownHandler, true);
	panel.addEventListener("mouseup", onMouseUpHandler, true);
};

var onStrokeChangeHandler = function(e) {

	ctx.lineWidth = parseInt(e.target.value, 10);
};

var onStrokeColorChangeHandler = function(e) {
	ctx.strokeStyle = e.target.value;
};

var onFillColorChangeHandler = function(e) {
	ctx.fillStyle = e.target.value;
};

var deactivateTools = function() {
	var activeElements = document.getElementsByClassName('active');
	for (var i in activeElements) {
		activeElements[i].className = '';
	}
};

var setTool = function(newCurrTool, bound) {
	currentTool.name = newCurrTool;
	currentTool.hasBoundingBox = bound;
};

var setTextTool = function() {
	var textElement = getId("text_btn");
	if (currentTool.name == TEXT_TOOL) {
		setTool("", false);
		textElement.className = "";
	} else {
		deactivateTools();
		textElement.className = "active";
		setTool(TEXT_TOOL, true);
		setStrokeToRound();
	}
};

var setRectangleTool = function() {
	var rectangleElement = getId("rectangle_btn");
	if (currentTool.name == RECTANGLE_TOOL) {
		setTool("", false);
		rectangleElement.className = "";
	} else {
		deactivateTools();
		rectangleElement.className = "active";
		setTool(RECTANGLE_TOOL, true);
		setStrokeToRound();
	}
};

setEraserTool = function() {
	var eraserElement = getId("eraser_btn");
	if (currentTool.name == ERASER_TOOL) {
		setTool("", false);
		eraserElement.className = "";
	} else {
		deactivateTools();
		eraserElement.className = "active";
		setTool(ERASER_TOOL, true);
		setStrokeToRound();
	}
};

var setFillTool = function() {
	var fillElement = getId("fill_btn");
	if (currentTool.name == FILL_TOOL) {
		setTool("", false);
		fillElement.className = "";
	} else {
		deactivateTools();
		fillElement.className = "active";
		setTool(FILL_TOOL, true);
		setStrokeToRound();
	}
};

var setBrushTool = function() {
	var brushElement = getId("brush_btn");
	if (isBrushTool()) {
		setTool("", false);
		brushElement.className = "";
	} else {
		deactivateTools();
		brushElement.className = "active";
		setTool(BRUSH_TOOL, false);
		setStrokeToRound();
	}
};

var setEllipseTool = function() {
	var ellipseElement = getId("ellipse_btn");
	if (isEllipseTool()) {
		setTool("", false);
		ellipseElement.className = "";
	} else {
		deactivateTools();
		ellipseElement.className = "active";
		setTool(ELLIPSE_TOOL, true);
		overlayCanvas.style.cursor = 'crosshair';
		setStrokeToRound();
	}
};

var setLineTool = function() {
	var lineElement = getId("line_btn");
	if (isLineTool()) {
		setTool("", false);
		lineElement.className = "";
	} else {
		deactivateTools();
		lineElement.className = "active";
		setTool(LINE_TOOL, true);
		overlayCanvas.style.cursor = 'crosshair';
		setStrokeToRound();
	}
};

var setSelectionTool = function() {
	var selectElement = getId("selection_btn");
	if (isSelectionTool()) {
		setTool("", false);
		selectElement.className = "";
	} else {
		deactivateTools();
		selectElement.className = "active";
		setTool(SELECTOR_TOOL, true);
		setStrokeToRound();
	}
}
var initControlPanel = function() {
	var stroke = getId("strokeSize");
	var strokeColor = getId("strokeColor");
	var fillColor = getId("fillColor");
	var fileUpload = getId("fileUpload");
	var addLayerButton = getId("addLayer");
	var clearButton = getId("clearCanvas");
	var rectButton = getId("rectangle_btn");
	var ellipseButton = getId("ellipse_btn");
	var fillButton = getId("fill_btn");
	var brushButton = getId("brush_btn");
	var eraseButton = getId("eraser_btn");
	var selectionButton = getId("selection_btn");
	var textButton = getId("text_btn");
	var lineButton = getId("line_btn");

	setStrokeToRound();

	stroke.onchange = onStrokeChangeHandler;
	strokeColor.onchange = onStrokeColorChangeHandler;
	fillColor.onchange = onFillColorChangeHandler;
	fileUpload.onchange = fileUploadHandler;
	addLayerButton.onclick = onAddLayerClickHandler;
	clearButton.onclick = clearCanvas;
	rectButton.onclick = setRectangleTool;
	ellipseButton.onclick = setEllipseTool;
	fillButton.onclick = setFillTool;
	brushButton.onclick = setBrushTool;
	eraseButton.onclick = setEraserTool;
	selectionButton.onclick = setSelectionTool;
	textButton.onclick = setTextTool;
	lineButton.onclick = setLineTool;
};

var setStrokeToRound = function() {
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
};

var initPopups = function() {
	initPopupDragListeners();
	initPopupCloseListeners();
};

var initPopupCloseListeners = function() {
	var popupCloseBtns = getClass('popupClose');
	for (var j = 0; j < popupCloseBtns.length; j++) {
		popupCloseBtns[j].onclick = closePopup;
	}
};

var initPopupDragListeners = function() {
	var popups = getClass('closablePopup');
	for (var i = 0; i < popups.length; i++) {
		popups[i].onmousedown = dragPopupDown;
	}
};

var init = function() {
	initPopups();
};

window.onload = init;
