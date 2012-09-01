/**
 * @author Brandon
 */

var fileUploadHandler = function(event) {
	var reader = createFileReader();
	reader.readAsDataURL(event.target.files[0]);
};

var createFileReader = function(event) {
	var reader = new FileReader();
	reader.onload = function(ev) {
		instantiateImageInstance(ev);
	}
	return reader;
};

var instantiateImageInstance = function(ev) {
	var img = new Image();
	img.onload = function() {
		addCanvas();
		ctx.drawImage(img, 0, 0);
	};
	img.src = ev.target.result;
};
