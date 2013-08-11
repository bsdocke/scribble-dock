var layerNum = 0;
var lineStarted = false;
var activeLayer;

var SELECTOR_TOOL = "Selector";
var RECTANGLE_TOOL = "Rectangle";
var ELLIPSE_TOOL = "Ellipse";
var LINE_TOOL = "Line";
var BRUSH_TOOL = "Brush";
var FILL_TOOL = "Fill";

var currentTool = {
	name : "",
	hasBoundingBox : false,
}

var isRectangleTool = function() {
	return currentTool.name == RECTANGLE_TOOL;
};

var isEllipseTool = function() {
	return currentTool.name == ELLIPSE_TOOL;
};

var isFillTool = function() {
	return currentTool.name == FILL_TOOL;
}
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
		} else if (isFillTool()) {
			//fill tool should be unresponsive to mouse movement
		} else {
			if (lineStarted) {
				ctx.lineTo(x, y);
				ctx.stroke();
			} else {
				ctx.beginPath();
				ctx.moveTo(x, y);
				//ctx.closePath();
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
	var panel = document.getElementById("workPanel");
	panel.addEventListener("mousemove", onMouseMoveHandler, true);
	if (!currentCanvas.locked && (isRectangleTool() || isEllipseTool())) {
		var point = findOffset(e.target);
		boundingBoxX = e.pageX - point.x;
		boundingBoxY = e.pageY - point.y;
	}
};

var removeMoveListenerFromWorkPanel = function() {
	var panel = document.getElementById("workPanel");
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
	var panel = document.getElementById("workPanel");
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
	var rectangleElement = document.getElementById("rectangle_btn");
	if (currentTool.name == RECTANGLE_TOOL) {
		setTool("", false);
		rectangleElement.className = "";
	} else {
		$('.active').attr('class', '');
		rectangleElement.className = "active";
		setTool(RECTANGLE_TOOL, true);
		setStrokeToRound();
	}
};

var setFillTool = function() {
	var fillElement = document.getElementById("fill_btn");
	if (currentTool.name == FILL_TOOL) {
		setTool("", false);
		fillElement.className = "";
	} else {
		$('.active').attr('class', '');
		fillElement.className = "active";
		setTool(FILL_TOOL, true);
		setStrokeToRound();
	}
};

var setEllipseTool = function() {
	var ellipseElement = document.getElementById("ellipse_btn");
	if (isEllipseTool()) {
		setTool("", false);
		ellipseElement.className = "";
	} else {
		$('.active').attr('class', '');
		ellipseElement.className = "active";
		setTool(ELLIPSE_TOOL, true);
		overlayCanvas.style.cursor = 'crosshair';
		setStrokeToRound();
	}
};

var initControlPanel = function() {
	var stroke = document.getElementById("strokeSize");
	var strokeColor = document.getElementById("strokeColor");
	var fillColor = document.getElementById("fillColor");
	var fileUpload = document.getElementById("fileUpload");
	var addLayerButton = document.getElementById("addLayer");
	var clearButton = document.getElementById("clearCanvas");
	var rectButton = document.getElementById("rectangle_btn");
	var ellipseButton = document.getElementById("ellipse_btn");
	var fillButton = document.getElementById("fill_btn");

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
};

var setStrokeToRound = function() {
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
};

var init = function() {
	initCanvases();
	initControlPanel();
	$("#layersList").dialog();
};

$(document).ready(function() {
	init();
});
