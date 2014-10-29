LayersView = Backbone.View.extend({
	el : $("#layersList"),
	initialize : function() {
		this.layers = new Layers(null, {
			view : this
		});
	},
	events : {
		"click input#addLayer" : "addLayer",
		"click .delBtn" : "deleteLayer"
	},
	deleteLayer : function(event) {
		var targetRow = event.target;
		var deleteNumber = targetRow.id.split("-")[1];
		var deleteItem = this.layers.get(deleteNumber);
		this.layers.remove(deleteItem);
	},
	removeLayerListener: function(model){
		$("#layer-row-" + model.id).remove();
		
	},
	addLayer : function(event) {
		var layer_name = "Layer " + layerNum;
		var layer_model = new Layer({
			_id : layerNum,
			name : layer_name,
			layerNumber : layerNum
		});
		layerNum++;
		this.layers.add(layer_model);
	},
	addLayerListener : function(model) {
		var table = $("#layersTable");
		var variables = {
			"layer_name" : model.get('name'),
			"layer_number" : model.get("layerNumber")
		};
		var template = _.template($("#layer-row-template").html(), variables);

		table.append(template(variables));

		/*
		 if (activeLayer)
		 activeLayer.style.background = "";

		 anchor.style.background = "#ff00ff";
		 anchor.addEventListener("click", onLayerClickHandler, true);
		 anchor.ondblclick = onLayerDoubleClickHandler;
		 anchor.canvas = currentCanvas;
		 activeLayer = anchor;*/

	}
});
