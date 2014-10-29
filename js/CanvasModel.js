Canvas = Backbone.Model.extend({
	width : null,
	height : null,
	layerNumber: null,
	layerName: null,
	idAttribute: "_id"
});

Canvases = Backbone.Collection.extend({
	initialize : function(models, options) {
		this.bind("add", options.view.addCanvasListener);
		this.bind("remove", options.view.removeCanvasListener);
	}
}); 