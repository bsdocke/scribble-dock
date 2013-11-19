
var drawEllipseOnContext = function(ctx, event) {
	var x, y;
	var point = findOffset(event.target);
	x = event.pageX - point.x;
	y = event.pageY - point.y;
	var w = Math.abs(x - boundingBoxX);
	var h = Math.abs(y - boundingBoxY);
	if (x < boundingBoxX) {
		if (y < boundingBoxY) {
			drawEllipseByCenter(ctx, boundingBoxX - w / 2, boundingBoxY - h / 2, w, h);
		} else {
			drawEllipseByCenter(ctx, boundingBoxX - w / 2, boundingBoxY + h / 2, w, h);
		}
	} else {
		if (y < boundingBoxY) {
			drawEllipseByCenter(ctx, boundingBoxX + w / 2, boundingBoxY - h / 2, w, h);
		} else {
			drawEllipseByCenter(ctx, boundingBoxX + w / 2, boundingBoxY + h / 2, w, h);
		}
	}
	ctx.stroke();
}
var drawEllipseByCenter = function(ctx, cx, cy, w, h) {
	drawEllipse(ctx, cx - w / 2.0, cy - h / 2.0, w, h);
};

var drawEllipse = function(ctx, x, y, w, h) {
	var kappa = .5522848, ox = (w / 2) * kappa, // control point offset horizontal
	oy = (h / 2) * kappa, // control point offset vertical
	xe = x + w, // x-end
	ye = y + h, // y-end
	xm = x + w / 2, // x-middle
	ym = y + h / 2;
	// y-middle

	ctx.beginPath();
	ctx.moveTo(x, ym);
	ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
	ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
	ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
	ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
	ctx.closePath();
	ctx.stroke();
};

var commitEllipseToCanvas = function(e) {
	ctx.beginPath();
	ctx.closePath();
	var w = overlayCanvas.width;
	var h = overlayCanvas.height;
	overlayCanvas.width = 1;
	overlayCanvas.width = w;
	overlayCtx.clearRect(0, 0, w, h);
	drawEllipseOnContext(ctx, e);
	ctx.fill();
};