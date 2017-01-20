var formatErrors = require("can-validate").formatErrors;
var validate = require("can-validate-validatejs");
var define = require("can-define");
var each = require("can-util/js/each/each");
var assign = require("can-util/js/assign/assign");
var isEmptyObject = require("can-util/js/is-empty-object/is-empty-object");

var getMapConstraints = function (Map) {
    var constraints = {};
    each(Map.prototype._define.definitions, function (prop, key) {
        constraints[key] = prop.validate;
    });
    return constraints;
};

var validateMap = function (Map, validator) {
    var mapDefinition = Map.prototype._define;

    Map.prototype.testSet = function() {
        var values = {};
        if (arguments.length) {
            // Check if testing many values or just one
            if (typeof arguments[0] === 'object') {
                values = arguments[0];
                useNewObject = Boolean(arguments[1]);
            } else {
                values[arguments[0]] = arguments[1];
                useNewObject = false;
            }

            // Merge values with existing map or with a new map
            if (useNewObject) {
                values = new Map.prototype.constructor(values);
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
        if(arguments.length) {
            var errorsObj = formatErrors(_errors, 'errors-object');
            errors = [];
            each(arguments, function (key) {
                [].push.apply(errors, errorsObj[key]);
            });
            errors = errors.length > 0 ? errors : undefined;
        } else {
            errors = _errors;
        }
        return errors;
    };

    define.property(Map.prototype, "_errors", {
        get: function(){
            var errors = validator(this);
            return errors;
        }
    }, mapDefinition.dataInitializers, mapDefinition.computedInitializers);
};

module.exports = function(Map) {
    var constraints = getMapConstraints(Map);
    var validator = validate.many(constraints);

    validateMap(Map, function (map) {
        var errors = validator(map);
        return formatErrors(errors, 'errors');
    });
};
