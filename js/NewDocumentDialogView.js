NewDocumentDialogView = Backbone.View.extend({

	events : {
		"click .popupClose": "destroy"
	},
	render : function() {
		var variables = {
			"close_id" : "newDocClose",
			"popup_title" : "New Document"
		};
		var template = _.template($("#popup-window-template").html(), variables);
		var templateDOM = template(variables);

		var newDocTemplate = _.template($("#new-document-popup-body").html());
		var newDocTemplateDOM = newDocTemplate();

		templateDOM.append(newDocTemplateDOM);
		return this;
	}
});
