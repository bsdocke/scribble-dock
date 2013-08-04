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
	name:"",
	hasBoundingBox:false,
}

var onAddLayerClickHandler = function(event){
	addCanvas();
};

var incrementLayerNumber = function(){
	layerNum++;
};

var onMouseMoveHandler = function(e) {
	var x, y;
	var point = findOffset(e.target);
	x = e.pageX - point.x;
	y = e.pageY - point.y;

	if(lineStarted) {
		ctx.lineTo(x, y);
		ctx.stroke();
	} else {
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.closePath();
		lineStarted = true;
	}

};

var findOffset = function(element){
	var left = 0;
	var top = 0;
	if(element.offsetParent){
		do{
			top += element.offsetTop;
			left += element.offsetLeft;
		}while(element = element.offsetParent);
		return {
			x: left,
			y: top
		};
	}
};

var onMouseDownHandler = function(e) {
	var panel = document.getElementById("workPanel");
	panel.addEventListener("mousemove", onMouseMoveHandler, true);
};

var onMouseUpHandler = function(e) {
	var panel = document.getElementById("workPanel");
	lineStarted = false;
	panel.removeEventListener("mousemove", onMouseMoveHandler, true);
};

var addEventsToCanvas = function() {
	var panel = document.getElementById("workPanel");
	panel.addEventListener("mousedown", onMouseDownHandler,true);
	panel.addEventListener("mouseup", onMouseUpHandler, true);
};

var onStrokeChangeHandler = function(e) {
	ctx.lineWidth = parseInt(e.target.value, 10);
};

var onFillColorChangeHandler = function(e) {
	ctx.strokeStyle = e.target.value;
};

var setTool = function(newCurrTool,bound){
	currentTool.name=newCurrTool;
	currentTool.hasBoundingBox=bound;
};

var initControlPanel = function() {
	var stroke = document.getElementById("strokeSize");
	var fillColor = document.getElementById("fillColor");
	var fileUpload = document.getElementById("fileUpload");
	var addLayerButton = document.getElementById("addLayer");
	var clearButton = document.getElementById("clearCanvas");
	var rectButton = document.getElementByid("rectangle_btn");
	
	setStrokeToRound();
	
	stroke.onchange = onStrokeChangeHandler;
	fillColor.onchange = onFillColorChangeHandler;
	fileUpload.onchange = fileUploadHandler;
	addLayerButton.onclick = onAddLayerClickHandler;
	clearButton.onclick = clearCanvas;
	rectButton.onclick = setTool(RECTANGLE_TOOL,true);
};

var setStrokeToRound = function(){
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
};

var onLayerClickHandler = function(e){
	if(activeLayer) activeLayer.style.background = "";
	updateCurrentCanvasVariables(e.target.canvas);
	addEventsToCanvas();
	activeLayer = e.target;
	activeLayer.style.background = "#ff00ff";
};

var onDeleteClickHandler = function(e){	
	updateCurrentCanvasVariables(document.getElementById("layer" + e.target.getAttribute("associatedLayer")).canvas);
	currentCanvas.parentNode.removeChild(currentCanvas);
	e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode);	
};

var addToLayerList = function(newCanvasRow){
	var table = document.getElementById("layersTable");
	var newRow = document.createElement("tr");
	var anchor = document.createElement("a");	
	
	if(activeLayer) activeLayer.style.background = "";
	anchor.setAttribute("id","layer" + layerNum);
	anchor.innerHTML = "Layer " + layerNum;
	table.appendChild(newRow);
	newRow.appendChild(anchor);
	insertLayerDeleteButton(newRow, layerNum);
	anchor.style.background = "#ff00ff";
	anchor.addEventListener("click",onLayerClickHandler,true);
	anchor.canvas = currentCanvas;
	activeLayer = anchor;
};

var insertLayerDeleteButton = function(element, layerNumber){
	var newCell = document.createElement("td");
	var delWrapper = document.createElement("a");
	delWrapper.innerHTML="X";
	delWrapper.className="delBtn";
	delWrapper.setAttribute("associatedLayer", layerNumber);
	delWrapper.addEventListener("click",onDeleteClickHandler,true);
	newCell.appendChild(delWrapper);
	element.appendChild(newCell);
};

var init = function() {	
	initCanvases();
	initControlPanel();	
	$("#layersList").dialog();
};

$(document).ready(function(){
	init();
});