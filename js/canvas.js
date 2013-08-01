/**
 * @author Brandon
 */

var ctx;
var canvases;
var currentCanvas;

var overlayCanvas;
var overlayCtx;

var getContext = function(canvas) {
	return canvas.getContext("2d");
};

var getCanvases = function() {
	return $("#workPanel").childNodes;
};

var initCanvases = function(){
	canvases = new Array();
	addCanvas();
};

var addCanvas = function() {
	var workPanel = document.getElementById("workPanel");
	var newCanvas = buildCanvas();
	
	updateCurrentCanvasVariables(newCanvas);
	incrementLayerNumber();
	addEventsToCanvas();
	addToLayerList(newCanvas);
	workPanel.appendChild(newCanvas);
	newCanvas.style.zIndex=layerNum
};

var updateCurrentCanvasVariables = function(newCanvas){
	if(!currentCanvas) currentCanvas = newCanvas;	
	ctx = updateContext(newCanvas.getContext('2d'));
	currentCanvas = newCanvas;
	if(canvases.indexOf(newCanvas) == -1) canvases.push(newCanvas);
};

var updateContext = function(newContext){
	var oldContext = getContext(currentCanvas);
	var updatedContext = newContext;
	
	return copyCtxProperties(oldContext, updatedContext);
};

var copyCtxProperties = function(oldCtx, newCtx){
	newCtx.lineCap = oldCtx.lineCap;
	newCtx.lineJoin = oldCtx.lineJoin;
	newCtx.lineWidth = oldCtx.lineWidth;
	newCtx.strokeStyle = oldCtx.strokeStyle;
	
	return newCtx;
}

var buildCanvas = function() {
	var newCanvas = buildCanvasWithDimensions(800,600);
	newCanvas = setCanvasId(newCanvas, "c_layer_" + layerNum);
	//newCanvas = (layerNum);

	return newCanvas;
};

var buildOverlayCanvas = function(){
	var newOverlayCanvas = buildCanvasWithDimensions(800,600);
	newCanvas = setCanvasId(newCanvas,"overlay_canvas");
	newCanvas = setCanvasStyle(Number.MAX_VALUE);
	
	return newOverlayCanvas;
};

var buildCanvasWithDimensions = function(width,height){
	var newCanvas = document.createElement("canvas");
	newCanvas.setAttribute("width", width);
	newCanvas.setAttribute("height", height);
	
	return newCanvas;
};

var setCanvasId = function(canvas, id){
	canvas.setAttribute("id", id);
	return canvas;
};

var setCanvasStyle = function(canvas, zIndex){
	canvas.setAttribute("style", "display:block; positoin: absolute; z-index: " + zIndex + ";");
	return canvas;
};

var clearCanvas = function() {
	ctx.clearRect(0, 0, currentCanvas.width, currentCanvas.height);
};