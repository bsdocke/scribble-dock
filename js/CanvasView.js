CanvasView = Backbone.View.extend({
	initialize : function() {
		this.canvases = new Layers(null, {
			view : this
		});
		this.initCanvases();
	},
	events : {
		"mousedown #workPanel" : "addLayer",
		"mousemove #workPanel" : "deleteLayer"
	},
	OVERLAY_Z_INDEX : 100000,
	ctx : null,
	currentCanvas : null,

	overlayCanvas : null,
	overlayCtx : null,

	/*var popupOriginalX;
	 var popupOriginalY;
	 var clickOriginalX;
	 var clickOriginalY;
	 */
	addCanvasListener : function(model) {
		/*
		var canvas_model = new Canvas({
					_id : layerNum,
					width : doc_width,
					height : doc_height,
					layerNumber : layerNum,
					layerName : model.get('name'),
				});
				this.canvases.add(canvas_model);*/
		
		addCanvas();
	},
	getContext : function(canvas) {
		return canvas.getContext("2d");
	},
	initCanvases : function() {
		initOverlay();
		addCanvas();
	},
	initOverlay : function() {
		var newCanvas = buildCanvas();
		$el.appendChild(newCanvas);
		newCanvas.className = "overlay_canvas";
		newCanvas.style.zIndex = OVERLAY_Z_INDEX;
		overlayCanvas = newCanvas;
		overlayCtx = getContext(newCanvas);
	},
	appendCanvas : function(canvasElement) {
		$el.appendChild(canvasElement);
	},
	addCanvas : function() {
		var newCanvas = buildCanvas();
		newCanvas.locked = false;
		updateCurrentCanvasVariables(newCanvas);
		addEventsToCanvas();
		appendCanvas(newCanvas);
		newCanvas.style.zIndex = layerNum;
	},
	updateCurrentCanvasVariables : function(newCanvas) {
		if (!currentCanvas)
			currentCanvas = newCanvas;
		ctx = updateContext(newCanvas.getContext('2d'));
		currentCanvas = newCanvas;
		if (isCanvasInList(newCanvas))
			canvases.push(newCanvas);
	},
	isCanvasInList : function(checkedCanvas) {
		return canvases.indexOf(checkedCanvas == -1);
	},
	updateContext : function(newContext) {
		var oldContext = getContext(currentCanvas);
		var updatedContext = newContext;

		return copyCtxProperties(oldContext, updatedContext);
	},
	copyCtxProperties : function(oldCtx, newCtx) {
		newCtx.lineCap = oldCtx.lineCap;
		newCtx.lineJoin = oldCtx.lineJoin;
		newCtx.lineWidth = oldCtx.lineWidth;
		newCtx.strokeStyle = oldCtx.strokeStyle;
		newCtx.fillStyle = oldCtx.fillStyle;

		return newCtx;
	},
	buildCanvas : function() {
		var newCanvas = buildCanvasWithDimensions(canvasWidth, canvasHeight);
		newCanvas = setCanvasId(newCanvas, "c_layer_" + layerNum);

		return newCanvas;
	},
	buildCanvasWithDimensions : function(width, height) {
		var newCanvas = document.createElement("canvas");
		newCanvas.setAttribute("width", width);
		newCanvas.setAttribute("height", height);

		return newCanvas;
	},
	setCanvasId : function(canvas, id) {
		canvas.setAttribute("id", id);
		return canvas;
	},
	setCanvasStyle : function(canvas, zIndex) {
		canvas.setAttribute("style", "display:block; position: absolute; z-index: " + zIndex + "; text-align: center;");
		return canvas;
	},
	clearCanvas : function() {
		var oldStrokeWidth = ctx.lineWidth;
		var oldStrokeStyle = ctx.strokeStyle;
		var oldFillStyle = ctx.fillStyle;
		currentCanvas.width = currentCanvas.width;
		ctx.lineWidth = oldStrokeWidth;
		ctx.strokeStyle = oldStrokeStyle;
		ctx.fillStyle = oldFillStyle;
		setStrokeToRound();
	},
	addEventsToCanvas : function() {
		$el.addEventListener("mousedown", onMouseDownHandler, true);
		$el.addEventListener("mouseup", onMouseUpHandler, true);
	}
});
