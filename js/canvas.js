/**
 * @author Brandon
 */

var ctx;
var canvases;
var currentCanvas;

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
};

var updateCurrentCanvasVariables = function(newCanvas){
	if(!currentCanvas) currentCanvas = newCanvas;	
	ctx = updateContext(newCanvas.getContext("2d"));
	currentCanvas = newCanvas;
	if(canvases.indexOf(newCanvas) == -1) canvases.push(newCanvas);
};

var updateContext = function(newContext){
	var oldContext = getContext(currentCanvas);
	var updatedContext = newContext;
	
	updatedContext.lineCap = oldContext.lineCap;
	updatedContext.lineJoin = oldContext.lineJoin;
	updatedContext.lineWidth = oldContext.lineWidth;
	updatedContext.strokeStyle = oldContext.strokeStyle;
	
	return updatedContext;
};

var buildCanvas = function() {
	var newCanvas = document.createElement("canvas");
	newCanvas.setAttribute("width", 800);
	newCanvas.setAttribute("height", 600);
	newCanvas.setAttribute("id", "c_layer_" + layerNum);
	newCanvas.setAttribute("style", "display:block; position: absolute; z-index: " + layerNum + ";");

	return newCanvas;
};

var clearCanvas = function() {
	ctx.clearRect(0, 0, currentCanvas.width, currentCanvas.height);
};