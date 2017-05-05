var formatErrors = require("can-validate").formatErrors;
var validate = require("can-validate-validatejs");
var define = require("can-define");
var each = require("can-util/js/each/each");
var assign = require("can-util/js/assign/assign");
var isEmptyObject = require("can-util/js/is-empty-object/is-empty-object");

// TODO: Move to can-define-validate
var getMapConstraints = function (Map) {
    var constraints = {};
    each(Map.prototype._define.definitions, function (prop, key) {
        // TODO: Will need to check for `related` properties here
        if (prop.validate && !isEmptyObject(prop.validate)) {
            constraints[key] = prop.validate;
        }
    });
    return constraints;
};

var validateMap = function (Map, validator) {
    var mapDefinition = Map.prototype._define;

    Map.prototype.testSet = function() {
        var values = {};
        var useNewObject = false;
        if (arguments.length) {
            // Check if testing many values or just one
            if (typeof arguments[0] === 'object' && Boolean(arguments[0])) {
                values = arguments[0];
                useNewObject = Boolean(arguments[1]);
            }

            // Check if testing single value
            if (typeof arguments[0] === 'string') {
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
            // TODO: when async, this will return a deferred?
            return validator(values);
        } else {
            // TODO: when async this could return a deferred?
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
                [].push.apply(errors, errorsObj ? errorsObj[key]: []);
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
            return Promise.all(errors);
        }
    }, mapDefinition.dataInitializers, mapDefinition.computedInitializers);
};

var decorator = function(Map) {
    var constraints = getMapConstraints(Map);

    // Create validator for each property and its constraints
    var validations = constraints.map(function(prop){
      // TODO: By using just the `validate` method, we run into the use case of
      // validating one property against another.
      // (ex: validate phone number based on country)...

      // 1) Use `validate` to validate a single property but force user to add
      // a related property to constraints. This means we need to strip out related
      // from constraints before sending it to validation library and that users
      // cannot use validateJS' custom validator API.

      // 2) Continue to use `validate.many` but then `many` will need to detect
      // promises BEFORE validation occurs (in order to use correct valdiatejs method)
      // return validate.many(prop);
      return validate(prop);
    });


    var validator = function (map) {
      var foundPromise = false;

      // process each validator, look for promises
      var results = validations.map(function(validate){
        var res = validate(someValue)

        if(!foundPromise && isPromise(res)) {
          foundPromise = true;
        }
        return res;
      });
      return foundPromise ? Promise.all(results) : results;
    }

    validateMap(Map, function (map) {
        var errors = validator(map);

        // TODO: build this method out in can-define-validate or can-validate?
        // errors = processRelatedErrors(errors);

        return formatErrors(errors, 'errors');
    });
};

// TODO: Don't need.
decorator.async = function (Map) {
    var constraints = getMapConstraints(Map);
    var validator = validate.async(constraints);

    validateMap(Map, function (map) {
        // Return compute that updates when async is done?
        return validator.async(map).then(function (errors) {
          return formatErrors(errors, 'errors');
        });
    });
};

decorator.validatejs = validate.validatejs;

module.exports = decorator;
