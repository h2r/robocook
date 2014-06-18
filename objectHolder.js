var ObjectHolder = function() {
	var holdingObject = null,
		oldX,
		oldY,
		X,
		Y,
		painter = new HoldingBoxPainter();

	this.IsHolding = function() {
		return (holdingObject !== null);
	};

	this.SetPosition = function(x, y) {
		X = x;
		Y = y;
		painter.setPosition(x, y);
	};

	this.SetHoldingObject = function(obj, x, y, tileX, tileY) {
		holdingObject = obj;

		oldX = x;
		oldY = y;

		painter.setHoldingObjectPainter(obj.getPainter(), tileX, tileY);
	};

	this.Pop = function() {
		var obj = holdingObject;
		holdingObject = null;
		painter.clearHoldingObjectPainter();
		return {object:obj, x:X, y:Y, oldX:oldX, oldY:oldY};
	};

	this.getPainter = function() {
		return painter;
	};

}