/**
 * @author Brandon
 */

var onAddLayerClickHandler = function(event) {
	addCanvas();
};

var incrementLayerNumber = function() {
	layerNum++;
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
	if(currentCanvas.locked){
		e.target.parentElement.style.background = 'red';
	}else{
		e.target.parentElement.style.background = "";
	}
}
var onDeleteClickHandler = function(e) {
	updateCurrentCanvasVariables(getId("layer" + e.target.getAttribute("associatedLayer")).canvas);
	currentCanvas.parentNode.removeChild(currentCanvas);
	e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode);
};

var addToLayerList = function(newCanvasRow) {
	var table = getId("layersTable");
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