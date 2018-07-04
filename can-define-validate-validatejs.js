"use strict";
var validate = require("can-validate-validatejs");
var define = require("can-define");
var assign = require("can-assign");
var canReflect = require("can-reflect");
var formatErrors = require("can-validate").formatErrors;

var getMapConstraints = function(Map) {
	var constraints = {};
	canReflect.eachKey(Map.prototype._define.definitions, function(prop, key) {
		if (prop.validate && canReflect.size(prop.validate)!== 0) {
			constraints[key] = prop.validate;
		}
	});
	return constraints;
};

var validateMap = function(Map, validator) {
	var mapDefinition = Map.prototype._define;

	Map.prototype.testSet = function() {
		var values = {};
		var useNewObject = false;
		if (arguments.length) {
			// Check if testing many values or just one
			if (typeof arguments[0] === "object" && Boolean(arguments[0])) {
				values = arguments[0];
				useNewObject = Boolean(arguments[1]);
			}

			// Check if testing single value
			if (typeof arguments[0] === "string") {
				values[arguments[0]] = arguments[1];
			}

			// Merge values with existing map or with a new map
			if (useNewObject) {
				values = new Map(values);
			} else {
				var mapClone = this.serialize();
				assign(mapClone, values);
				values = mapClone;
			}
			return validator(values);
		} else {
			return this.errors();
		}
	};

	Map.prototype.errors = function() {
		var _errors = this._errors;
		var errors;
		if (arguments.length) {
			var errorsObj = formatErrors(_errors, "errors-object");
			errors = [];

			canReflect.eachIndex(arguments, function(key) {
				[].push.apply(errors, errorsObj ? errorsObj[key] : []);
			});
			errors = errors.length > 0 ? errors : undefined;
		} else {
			errors = _errors;
		}
		return errors;
	};

	define.property(
		Map.prototype,
		"_errors",
		{
			get: function() {
				var errors = validator(this);
				return errors;
			}
		},
		mapDefinition.dataInitializers,
		mapDefinition.computedInitializers
	);
};

var decorator = function(Map) {
	var constraints = getMapConstraints(Map);
	var validator = validate.many(constraints);

	validateMap(Map, function(map) {
		var errors = validator(map);
		return formatErrors(errors, "errors");
	});
};

decorator.validatejs = validate.validatejs;

module.exports = decorator;
