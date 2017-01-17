var define = require('can-define');
var assign = require("can-util/js/assign/assign");
var DefineMap = require('can-define/map/map');

var oldExtensions = define.extensions;

define.behaviors.push('stream');

define.extensions = function (objPrototype, prop, definition) {

	if (definition.validate) {
        // TODO this is from can-define-stream...
		return assign({
			value: function() {
				return makeComputeFromStream(this, definition.stream);
			}
		}, define.types.compute);

	} else {
		return oldExtensions.apply(this, arguments);
	}
};

DefineMap.prototype.testSet = function() {
	[].unshift.call(arguments, this);
	return canStream.toStream.apply(this, arguments);
};

// TODO Should be a compute
DefineMap.prototype.errors = function() {
	[].unshift.call(arguments, this);
	return canStream.toStream.apply(this, arguments);
};
