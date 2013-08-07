/**
 * @author Brandon
 */
var OVERLAY_Z_INDEX = 100000;
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
	initOverlay();
	addCanvas();
};

var initOverlay = function(){
	var workPanel = getWorkPanel();
	var newCanvas = buildCanvas();
	workPanel.appendChild(newCanvas);
	newCanvas.className="overlay_canvas";
	newCanvas.style.zIndex=OVERLAY_Z_INDEX;
	overlayCanvas = newCanvas;
	overlayCtx = newCanvas.getContext('2d');
};

var getWorkPanel = function(){
	return document.getElementById("workPanel");
};

var appendCanvas = function(canvasElement){
	getWorkPanel().appendChild(canvasElement);
};

var addCanvas = function() {
	var newCanvas = buildCanvas();
	
	updateCurrentCanvasVariables(newCanvas);
	incrementLayerNumber();
	addEventsToCanvas();
	addToLayerList(newCanvas);
	appendCanvas(newCanvas);
	newCanvas.style.zIndex=layerNum;
};

var updateCurrentCanvasVariables = function(newCanvas){
	if(!currentCanvas) currentCanvas = newCanvas;	
	ctx = updateContext(newCanvas.getContext('2d'));
	currentCanvas = newCanvas;
	if(isCanvasInList(newCanvas)) canvases.push(newCanvas);
};

var isCanvasInList = function(checkedCanvas){
	return canvases.indexOf(checkedCanvas == -1);
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
	newCtx.fillStyle = oldCtx.fillStyle;
	
	return newCtx;
}

var buildCanvas = function() {
	var newCanvas = buildCanvasWithDimensions(800,600);
	newCanvas = setCanvasId(newCanvas, "c_layer_" + layerNum);
	//newCanvas = (layerNum);

	return newCanvas;
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
	var oldStrokeWidth = ctx.lineWidth;
	var oldStrokeStyle = ctx.strokeStyle;
	var oldFillStyle = ctx.fillStyle;
	currentCanvas.width = currentCanvas.width;
	ctx.lineWidth = oldStrokeWidth;
	ctx.strokeStyle = oldStrokeStyle;
	ctx.fillStyle = oldFillStyle;
	setStrokeToRound();
	//ctx.clearRect(0, 0, currentCanvas.width, currentCanvas.height);
};