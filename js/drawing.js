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

var commitRectangleToCanvas = function(e) {
	ctx.beginPath();
	ctx.closePath();
	var w = overlayCanvas.width;
	var h = overlayCanvas.height;
	overlayCanvas.width = 1;
	overlayCanvas.width = w;
	overlayCtx.clearRect(0, 0, w, h);
	drawRectangleOnContext(ctx, e);
	ctx.fill();
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
			ctx.beginPath();
			ctx.closePath();
			var tracer = new Array(currentCanvas.width);
			for (var i = 0; i < tracer.length; i++) {
				tracer[i] = new Array(currentCanvas.height);
			}

			var x, y;
			var clickpoint = findOffset(e.target);
			x = e.pageX - clickpoint.x;
			y = e.pageY - clickpoint.y;

			var trail = new Array();
			//get target pixel color and coordinates
			var point = {
				x : x,
				y : y
			};
			trail.push({
				x : point.x + 1,
				y : point.y
			});
			trail.push({
				x : point.x - 1,
				y : point.y
			});
			trail.push({
				x : point.x,
				y : point.y - 1
			});
			trail.push({
				x : point.x,
				y : point.y + 1
			});

			var initData = ctx.getImageData(0, 0, currentCanvas.width, currentCanvas.height);
			var initpix = initData.data;
			var colorInjectionData = hexToRgb(ctx.fillStyle);
			var finalPosition = getPixelArrayPosition(point.x, point.y);

			var segmentColor = rgbToHex(initpix[finalPosition], initpix[finalPosition + 1], initpix[finalPosition + 2]);
			var segmentAlpha = initpix[finalPosition + 3];
			if (pixelInBounds(point) && !colorsMatch(ctx.fillStyle, segmentColor, 255, segmentAlpha)) {
				setPixelColor(initpix, finalPosition, colorInjectionData);
				tracer[point.x][point.y] = true;

			}
			while (trail.length > 0) {

				var transition = trail.pop();
				finalPosition = getPixelArrayPosition(transition.x, transition.y);
				tracer[transition.x][transition.y] = true;

				if (pixelInBounds(transition)) {
					var nexthex = rgbToHex(getRed(initpix, finalPosition), getGreen(initpix, finalPosition), getBlue(initpix, finalPosition));
					if (shouldBeFilled(segmentColor, nexthex, segmentAlpha, initpix[finalPosition + 3])) {
						setPixelColor(initpix, finalPosition, colorInjectionData);
						tracer[transition.x][transition.y] = true;

						var rightNode = {
							x : transition.x + 1,
							y : transition.y
						};
						var leftNode = {
							x : transition.x - 1,
							y : transition.y
						};
						var upNode = {
							x : transition.x,
							y : transition.y - 1
						};
						var downNode = {
							x : transition.x,
							y : transition.y + 1
						};
						if (pixelInBounds(rightNode) && !tracer[rightNode.x][rightNode.y])
							trail.push(rightNode);
						if (pixelInBounds(leftNode) && !tracer[leftNode.x][leftNode.y])
							trail.push(leftNode);
						if (pixelInBounds(upNode) && !tracer[upNode.x][upNode.y])
							trail.push(upNode);
						if (pixelInBounds(rightNode) && !tracer[downNode.x][downNode.y])
							trail.push(downNode);
					}
				}
			}
			ctx.putImageData(initData, 0, 0);
		}
	}
};

var setPixelColor = function(pixelData, offset, colorData) {
	pixelData[offset] = colorData.r;
	pixelData[offset + 1] = colorData.g;
	pixelData[offset + 2] = colorData.b;
	pixelData[offset + 3] = 255;
}
var shouldBeFilled = function(contiguousColor, targetColor, alpha1, alpha2) {
	return !colorsMatch(ctx.fillStyle, targetColor, 255, alpha2) && colorsMatch(targetColor, contiguousColor, alpha1, alpha2);
}
var pixelInBounds = function(pixel) {
	return (pixel.x < currentCanvas.width && pixel.x >= 0) && (pixel.y < currentCanvas.height && pixel.y >= 0);
};

var colorsMatch = function(oneColor, twoColor, alpha1, alpha2) {
	return oneColor == twoColor && alpha1 == alpha2;
};

var getRed = function(pixelArray, offset) {
	return pixelArray[offset];
};

var getGreen = function(pixelArray, offset) {
	return pixelArray[offset + 1];
};

var getBlue = function(pixelArray, offset) {
	return pixelArray[offset + 2];
};

var getAlpha = function(pixelArray, offset) {
	return pixelArray[offset + 3];
};

var getPixelArrayPosition = function(x, y) {
	return 4 * (x + currentCanvas.width * y);
};

var componentToHex = function(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
};

var hexToRgb = function(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r : parseInt(result[1], 16),
		g : parseInt(result[2], 16),
		b : parseInt(result[3], 16),
	} : null;
};
var rgbToHex = function(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

var drawRectangleOnContext = function(ctx, event) {
	var x, y;
	var point = findOffset(event.target);
	x = event.pageX - point.x;
	y = event.pageY - point.y;
	if (x < boundingBoxX) {
		if (y < boundingBoxY) {
			ctx.rect(x, y, Math.abs(boundingBoxX - x), Math.abs(boundingBoxY - y));
		} else {
			ctx.rect(x, boundingBoxY, Math.abs(boundingBoxX - x), Math.abs(boundingBoxY - y));
		}
	} else {
		if (y < boundingBoxY) {
			ctx.rect(boundingBoxX, y, Math.abs(x - boundingBoxX), Math.abs(boundingBoxY - y));
		} else {
			ctx.rect(boundingBoxX, boundingBoxY, Math.abs(x - boundingBoxX), Math.abs(y - boundingBoxY));
		}
	}
	ctx.stroke();
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

var onFillColorChangeHandler = function(e) {
	ctx.strokeStyle = e.target.value;
};

var onInteriorFillColorChangeHandler = function(e) {
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
	var fillColor = document.getElementById("fillColor");
	var interiorFillColor = document.getElementById("interiorFillColor");
	var fileUpload = document.getElementById("fileUpload");
	var addLayerButton = document.getElementById("addLayer");
	var clearButton = document.getElementById("clearCanvas");
	var rectButton = document.getElementById("rectangle_btn");
	var ellipseButton = document.getElementById("ellipse_btn");
	var fillButton = document.getElementById("fill_btn");

	setStrokeToRound();

	stroke.onchange = onStrokeChangeHandler;
	fillColor.onchange = onFillColorChangeHandler;
	interiorFillColor.onchange = onInteriorFillColorChangeHandler;
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

var onLayerClickHandler = function(e) {
	if (activeLayer)
		activeLayer.style.background = "";
	updateCurrentCanvasVariables(e.target.canvas);
	addEventsToCanvas();
	activeLayer = e.target;
	activeLayer.style.background = "#ff00ff";
};

var onLockClickHandler = function(e) {
	currentCanvas.locked = !currentCanvas.locked;
}
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
	insertLayerLockButton(newRow, layerNum);
	insertLayerDeleteButton(newRow, layerNum);
	anchor.style.background = "#ff00ff";
	anchor.addEventListener("click", onLayerClickHandler, true);
	anchor.canvas = currentCanvas;
	activeLayer = anchor;
};

var insertLayerLockButton = function(element, layerNumber) {
	var newCell = document.createElement("td");
	var lockWrapper = document.createElement("a");
	var lockImg = document.createElement("img");
	lockImg.setAttribute('src', './assets/lock.gif');
	lockWrapper.className = "lockBtn";
	lockWrapper.setAttribute("associatedLayer", layerNumber);
	lockWrapper.addEventListener("click", onLockClickHandler, true);
	newCell.appendChild(lockWrapper);
	lockWrapper.appendChild(lockImg);
	element.appendChild(newCell);
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
