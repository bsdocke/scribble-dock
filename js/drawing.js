var layerNum = 0;
var lineStarted = false;
var activeLayer;

var SELECTOR_TOOL = "Selector";
var RECTANGLE_TOOL = "Rectangle";
var ELLIPSE_TOOL = "Ellipse";
var LINE_TOOL = "Line";
var BRUSH_TOOL = "Brush";
var FILL_TOOL = "Fill";
var ERASER_TOOL = "Eraser";

var currentTool = {
	name : "",
	hasBoundingBox : false,
}

var isRectangleTool = function() {
	return currentTool.name == RECTANGLE_TOOL;
};

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
			//overlayCtx.stroke();
			drawRectangleOnContext(overlayCtx, e);
		} else if (isEllipseTool()) {
			overlayCtx.beginPath();
			overlayCtx.closePath();
			var w = overlayCanvas.width;
			var h = overlayCanvas.height;
			overlayCtx.clearRect(0, 0, w, h);
			drawEllipseOnContext(overlayCtx, e);
		} else if (isBrushTool()) {
			if (lineStarted) {
				ctx.lineTo(x, y);
				ctx.stroke();
			} else {
				ctx.beginPath();
				ctx.moveTo(x, y);
				//ctx.closePath();
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
	var panel = getId("workPanel");
	panel.addEventListener("mousemove", onMouseMoveHandler, true);
	if (!currentCanvas.locked && (isRectangleTool() || isEllipseTool())) {
		var point = findOffset(e.target);
		boundingBoxX = e.pageX - point.x;
		boundingBoxY = e.pageY - point.y;
	}
};

var removeMoveListenerFromWorkPanel = function() {
	var panel = getId("workPanel");
	panel.removeEventListener("mousemove", onMouseMoveHandler, true);
};

var commitEllipseToCanvas = function(e) {
	ctx.beginPath();
	ctx.closePath();
	var w = overlayCanvas.width;
	var h = overlayCanvas.height;
	overlayCanvas.width = 1;
	overlayCanvas.width = w;
	overlayCtx.clearRect(0, 0, w, h);
	drawEllipseOnContext(ctx, e);
	ctx.fill();
}
var onMouseUpHandler = function(e) {
	
	removeMoveListenerFromWorkPanel();
	lineStarted = false;
	if (!currentCanvas.locked) {
		if (isRectangleTool()) {
			commitRectangleToCanvas(e);
		} else if (isEllipseTool()) {
			commitEllipseToCanvas(e);
		} else if (isFillTool()) {
			commitFillToCanvas(e);
		} else if (isEraserTool()){
			ctx.globalCompositeOperation = "destination-over";
		}
	}
};

var drawEllipseOnContext = function(ctx, event) {
	var x, y;
	var point = findOffset(event.target);
	x = event.pageX - point.x;
	y = event.pageY - point.y;
	var w = Math.abs(x - boundingBoxX);
	var h = Math.abs(y - boundingBoxY);
	if (x < boundingBoxX) {
		if (y < boundingBoxY) {
			drawEllipseByCenter(ctx, boundingBoxX - w / 2, boundingBoxY - h / 2, w, h);
		} else {
			drawEllipseByCenter(ctx, boundingBoxX - w / 2, boundingBoxY + h / 2, w, h);
		}
	} else {
		if (y < boundingBoxY) {
			drawEllipseByCenter(ctx, boundingBoxX + w / 2, boundingBoxY - h / 2, w, h);
		} else {
			drawEllipseByCenter(ctx, boundingBoxX + w / 2, boundingBoxY + h / 2, w, h);
		}
	}
	ctx.stroke();
}
var drawEllipseByCenter = function(ctx, cx, cy, w, h) {
	drawEllipse(ctx, cx - w / 2.0, cy - h / 2.0, w, h);
};

var drawEllipse = function(ctx, x, y, w, h) {
	var kappa = .5522848, ox = (w / 2) * kappa, // control point offset horizontal
	oy = (h / 2) * kappa, // control point offset vertical
	xe = x + w, // x-end
	ye = y + h, // y-end
	xm = x + w / 2, // x-middle
	ym = y + h / 2;
	// y-middle

	ctx.beginPath();
	ctx.moveTo(x, ym);
	ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
	ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
	ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
	ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
	ctx.closePath();
	ctx.stroke();
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
}
var setTool = function(newCurrTool, bound) {
	currentTool.name = newCurrTool;
	currentTool.hasBoundingBox = bound;
};

var setRectangleTool = function() {
	var rectangleElement = getId("rectangle_btn");
	if (currentTool.name == RECTANGLE_TOOL) {
		setTool("", false);
		rectangleElement.className = "";
	} else {
		deactivateTools():
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
		deactivateTools():
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
		deactivateTools():
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

var deactiveTools = function(){
	var activeElements = document.getElementsByClassName('active');
	for (var i in activeElements){
		activeElements[i]. className = '';
	}
};

var setSelectionTool = function(){
	var selectElement = getId("select_btn");
	if(isSelectionTool()){
		setTool("", false);
		selectElement.className = "";
	} else{
		var activeElements = document.getElementsByClassName('active');
		for(var i in activeElements){
			activeElements[i].className = '';
		}
		selectElement.className = "active";
		setTool(SELECT_TOOL, true);
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
};

var setStrokeToRound = function() {
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
};

var initPopups = function(){
	var popups = document.getElementsByClassName('closablePopup');
	var popupCloseBtns = document.getElementsByClassName('popupClose');
	
	for (var i = 0; i < popups.length; i++) {
		popups[i].onmousedown = dragPopupDown;
	}
	
	for (var j = 0; j < popupCloseBtns.length; j++) {
		popupCloseBtns[j].onclick = closePopup;
	}
}

var init = function() {
	//initCanvases();
	//initControlPanel();
	initPopups();	

};

window.onload = init;

/*
 $(document).ready(function() {
 init();
 }); */

