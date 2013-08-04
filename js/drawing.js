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

var onAddLayerClickHandler = function(event) {
	addCanvas();
};

var incrementLayerNumber = function() {
	layerNum++;
};

var isRectangleTool = function() {
	return currentTool.name == RECTANGLE_TOOL;
};

var onMouseMoveHandler = function(e) {
	var x, y;
	var point = findOffset(e.target);
	x = e.pageX - point.x;
	y = e.pageY - point.y;

	if (isRectangleTool()) {
		overlayCanvas.width = overlayCanvas.width;
		drawRectangleOnContext(overlayCtx,e);
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
	if (currentTool.name == RECTANGLE_TOOL) {
		var point = findOffset(e.target);
		rectX = e.pageX - point.x;
		rectY = e.pageY - point.y;
	}
};

var onMouseUpHandler = function(e) {
	var panel = document.getElementById("workPanel");
	lineStarted = false;
	panel.removeEventListener("mousemove", onMouseMoveHandler, true);
	if (isRectangleTool()) {
		ctx.beginPath();
		ctx.closePath();
		overlayCanvas.width = overlayCanvas.width;
		drawRectangleOnContext(ctx, e);
		ctx.fill();
	}
};

var drawRectangleOnContext = function(ctx, event) {
	var x, y;
	var point = findOffset(event.target);
	x = event.pageX - point.x;
	y = event.pageY - point.y;
	if (x < rectX) {
		if (y < rectY) {
			ctx.rect(x, y, Math.abs(rectX - x), Math.abs(rectY - y));
		} else {
			ctx.rect(x, rectY, Math.abs(rectX - x), Math.abs(rectY - y));
		}
	} else {
		if (y < rectY) {
			ctx.rect(rectX, y, Math.abs(x - rectX), Math.abs(rectY - y));
		} else {
			ctx.rect(rectX, rectY, Math.abs(x - rectX), Math.abs(y - rectY));
		}
	}
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

var onFillColorChangeHandler = function(e) {
	ctx.strokeStyle = e.target.value;
};

var onInteriorFillColorChangeHandler = function(e){
	ctx.fillStyle = e.target.value;
}

var setTool = function(newCurrTool, bound) {
	currentTool.name = newCurrTool;
	currentTool.hasBoundingBox = bound;
};

var setRectangleTool = function() {
	if (currentTool.name == RECTANGLE_TOOL) {
		setTool("", false);
		var rectangleElement = document.getElementById("rectangle_btn");
		rectangleElement.className = "";
	} else {
		var rectangleElement = document.getElementById("rectangle_btn");
		rectangleElement.className = "active";
		setTool(RECTANGLE_TOOL, true);
		setStrokeToRound();
	}
};

var initControlPanel = function() {
	var stroke = document.getElementById("strokeSize");
	var fillColor = document.getElementById("fillColor");
	var interiorFillColor = document.getElementById("interiorFillColor");
	var fileUpload = document.getElementById("fileUpload");
	var addLayerButton = document.getElementById("addLayer");
	var clearButton = document.getElementById("clearCanvas");
	var rectButton = document.getElementById("rectangle_btn");

	setStrokeToRound();

	stroke.onchange = onStrokeChangeHandler;
	fillColor.onchange = onFillColorChangeHandler;
	interiorFillColor.onchange = onInteriorFillColorChangeHandler;
	fileUpload.onchange = fileUploadHandler;
	addLayerButton.onclick = onAddLayerClickHandler;
	clearButton.onclick = clearCanvas;
	rectButton.onclick = setRectangleTool;
};

var setStrokeToRound = function() {
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
};

var onLayerClickHandler = function(e) {
	if (activeLayer)
		activeLayer.style.background = "";
	updateCurrentCanvasVariables(e.target.canvas);
	addEventsToCanvas();
	activeLayer = e.target;
	activeLayer.style.background = "#ff00ff";
};

var onDeleteClickHandler = function(e) {
	updateCurrentCanvasVariables(document.getElementById("layer" + e.target.getAttribute("associatedLayer")).canvas);
	currentCanvas.parentNode.removeChild(currentCanvas);
	e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode);
};

var addToLayerList = function(newCanvasRow) {
	var table = document.getElementById("layersTable");
	var newRow = document.createElement("tr");
	var anchor = document.createElement("a");

	if (activeLayer)
		activeLayer.style.background = "";
	anchor.setAttribute("id", "layer" + layerNum);
	anchor.innerHTML = "Layer " + layerNum;
	table.appendChild(newRow);
	newRow.appendChild(anchor);
	insertLayerDeleteButton(newRow, layerNum);
	anchor.style.background = "#ff00ff";
	anchor.addEventListener("click", onLayerClickHandler, true);
	anchor.canvas = currentCanvas;
	activeLayer = anchor;
};

var insertLayerDeleteButton = function(element, layerNumber) {
	var newCell = document.createElement("td");
	var delWrapper = document.createElement("a");
	delWrapper.innerHTML = "X";
	delWrapper.className = "delBtn";
	delWrapper.setAttribute("associatedLayer", layerNumber);
	delWrapper.addEventListener("click", onDeleteClickHandler, true);
	newCell.appendChild(delWrapper);
	element.appendChild(newCell);
};

var init = function() {
	initCanvases();
	initControlPanel();
	$("#layersList").dialog();
};

$(document).ready(function() {
	init();
});
