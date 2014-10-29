Layer = Backbone.Model.extend({
	name : null,
	layerNumber : -1,
	idAttribute: "_id"
});

Layers = Backbone.Collection.extend({
	initialize : function(models, options) {
		this.bind("add", options.view.addLayerListener);
		this.bind("add", options.view.addCanvasListener);
		this.bind("remove", options.view.removeLayerListener);
		this.bind("remove", options.view.removeCanvasListener);
	}
}); 