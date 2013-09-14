/**
 * @author Brandon
 */

var drawRectangleOnContext = function(ctx, event) {
	var x, y;
	var point = findOffset(event.target);
	x = event.pageX - point.x;
	y = event.pageY - point.y;
	if (x < boundingBoxX) {
		if (y < boundingBoxY) {
			ctx.rect(x, y, Math.abs(boundingBoxX - x), Math.abs(boundingBoxY - y));
		} else {
			ctx.rect(x, boundingBoxY, Math.abs(boundingBoxX - x), Math.abs(boundingBoxY - y));
		}
	} else {
		if (y < boundingBoxY) {
			ctx.rect(boundingBoxX, y, Math.abs(x - boundingBoxX), Math.abs(boundingBoxY - y));
		} else {
			ctx.rect(boundingBoxX, boundingBoxY, Math.abs(x - boundingBoxX), Math.abs(y - boundingBoxY));
		}
	}
	ctx.stroke();
}; 

var commitRectangleToCanvas = function(e) {
	ctx.beginPath();
	ctx.closePath();
	var w = overlayCanvas.width;
	var h = overlayCanvas.height;
	overlayCanvas.width = 1;
	overlayCanvas.width = w;
	overlayCtx.clearRect(0, 0, w, h);
	drawRectangleOnContext(ctx, e);
	ctx.fill();
};
