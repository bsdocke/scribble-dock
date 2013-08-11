/**
 * @author Brandon
 */

var commitFillToCanvas = function(e) {

	ctx.beginPath();
	ctx.closePath();
	var tracer = new Array(currentCanvas.width);
	for (var i = 0; i < tracer.length; i++) {
		tracer[i] = new Array(currentCanvas.height);
	}

	var x, y;
	var clickpoint = findOffset(e.target);
	x = e.pageX - clickpoint.x;
	y = e.pageY - clickpoint.y;

	var trail = new Array();
	//get target pixel color and coordinates
	var point = {
		x : x,
		y : y
	};
	trail.push({
		x : point.x + 1,
		y : point.y
	});
	trail.push({
		x : point.x - 1,
		y : point.y
	});
	trail.push({
		x : point.x,
		y : point.y - 1
	});
	trail.push({
		x : point.x,
		y : point.y + 1
	});

	var initData = ctx.getImageData(0, 0, currentCanvas.width, currentCanvas.height);
	var initpix = initData.data;
	var colorInjectionData = hexToRgb(ctx.fillStyle);
	var finalPosition = getPixelArrayPosition(point.x, point.y);

	var segmentColor = rgbToHex(initpix[finalPosition], initpix[finalPosition + 1], initpix[finalPosition + 2]);
	var segmentAlpha = initpix[finalPosition + 3];
	if (pixelInBounds(point) && !colorsMatch(ctx.fillStyle, segmentColor, 255, segmentAlpha)) {
		setPixelColor(initpix, finalPosition, colorInjectionData);
		tracer[point.x][point.y] = true;

	}
	while (trail.length > 0) {

		var transition = trail.pop();
		finalPosition = getPixelArrayPosition(transition.x, transition.y);
		tracer[transition.x][transition.y] = true;

		if (pixelInBounds(transition)) {
			var nexthex = rgbToHex(getRed(initpix, finalPosition), getGreen(initpix, finalPosition), getBlue(initpix, finalPosition));
			if (shouldBeFilled(segmentColor, nexthex, segmentAlpha, initpix[finalPosition + 3])) {
				setPixelColor(initpix, finalPosition, colorInjectionData);
				tracer[transition.x][transition.y] = true;

				var rightNode = {
					x : transition.x + 1,
					y : transition.y
				};
				var leftNode = {
					x : transition.x - 1,
					y : transition.y
				};
				var upNode = {
					x : transition.x,
					y : transition.y - 1
				};
				var downNode = {
					x : transition.x,
					y : transition.y + 1
				};
				if (pixelInBounds(rightNode) && !tracer[rightNode.x][rightNode.y])
					trail.push(rightNode);
				if (pixelInBounds(leftNode) && !tracer[leftNode.x][leftNode.y])
					trail.push(leftNode);
				if (pixelInBounds(upNode) && !tracer[upNode.x][upNode.y])
					trail.push(upNode);
				if (pixelInBounds(rightNode) && !tracer[downNode.x][downNode.y])
					trail.push(downNode);
			}
		}
	}
	ctx.putImageData(initData, 0, 0);
}
var setPixelColor = function(pixelData, offset, colorData) {
	pixelData[offset] = colorData.r;
	pixelData[offset + 1] = colorData.g;
	pixelData[offset + 2] = colorData.b;
	pixelData[offset + 3] = 255;
}
var shouldBeFilled = function(contiguousColor, targetColor, alpha1, alpha2) {
	return !colorsMatch(ctx.fillStyle, targetColor, 255, alpha2) && colorsMatch(targetColor, contiguousColor, alpha1, alpha2);
}
var pixelInBounds = function(pixel) {
	return (pixel.x < currentCanvas.width && pixel.x >= 0) && (pixel.y < currentCanvas.height && pixel.y >= 0);
};

var colorsMatch = function(oneColor, twoColor, alpha1, alpha2) {
	return oneColor == twoColor && alpha1 == alpha2;
};

var getRed = function(pixelArray, offset) {
	return pixelArray[offset];
};

var getGreen = function(pixelArray, offset) {
	return pixelArray[offset + 1];
};

var getBlue = function(pixelArray, offset) {
	return pixelArray[offset + 2];
};

var getAlpha = function(pixelArray, offset) {
	return pixelArray[offset + 3];
};

var getPixelArrayPosition = function(x, y) {
	return 4 * (x + currentCanvas.width * y);
};

var componentToHex = function(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
};

var hexToRgb = function(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r : parseInt(result[1], 16),
		g : parseInt(result[2], 16),
		b : parseInt(result[3], 16),
	} : null;
};

var rgbToHex = function(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};
