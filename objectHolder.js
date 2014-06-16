var ObjectHolder = function() {
	var holdingObject = null,
		oldX,
		oldY,
		painter = new HoldingBoxPainter();

	this.IsHolding = function() {
		return (holdingObject !== null);
	};

	this.SetPosition = function(x, y) {
		painter.SetX(x);
		painter.SetY(y);
	};

	this.SetHoldingObject = function(obj, x, y) {
		holdingObject = obj;
		oldX = x;
		oldY = y;
		painter.setHoldingObjectPainter(obj.getPainter());
	};

	this.Pop = function() {
		var obj = holdingObject;
		holdingObject = null;
		painter.clearHoldingObjectPainter();
		return {object:obj, x:oldX, y:oldY};
	};

}